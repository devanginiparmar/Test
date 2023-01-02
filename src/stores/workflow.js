import { defineStore } from 'pinia';
//import eventBus from '@/components/workflow/eventbus.js';
import { useVueFlow } from '@vue-flow/core';

export const useWorkflowStore = defineStore('workflow', {
  state: () => ({
    nodeConfigMap: {},
    undoStack: [],
    redoStack: []
  }),
  actions: {
    initConfig(nodeId) {
      if (!this.nodeConfigMap[nodeId]) {
        this.nodeConfigMap[nodeId] = {
          availableDatasets: [],
          operations: [],
          errors: [],
          connections: new Set()
        };
      }
    },

    // might not be required
    addOperation(nodeId, { type, operation, input, output }) {
      this.nodeConfigMap[nodeId].operations.push({
        type,
        operation,
        input,
        output
      });
    },

    // use if after validating node's operation
    // review ds later
    syncGeneratedFields(generatedFields, nodeId) {
      this.nodeConfigMap[nodeId].availableDatasets = this.nodeConfigMap[nodeId].availableDatasets.map((ds) => ({
        ...ds,
        fields: ds.fields.flatMap((field) => {
          if (field.generatedNodeId === nodeId && generatedFields[ds.datasetId][field.name] === undefined) {
            return [];
          } else {
            return [field];
          }
        })
      }));
    },

    removeConfig(nodeId) {
      delete this.nodeConfigMap[nodeId];
    },

    createDataset(name, nodeId) {
      this.nodeConfigMap[nodeId].availableDatasets.push({
        name,
        datasetId: name,
        label: name,
        fields: [],
        connections: [nodeId],
        generatedNodeId: nodeId
      });
    },

    createField(name, nodeId, datasetId) {
      const ds = this.nodeConfigMap[nodeId].availableDatasets.find((ds) => ds.datasetId === datasetId);
      if (ds) {
        ds.fields.push({
          name,
          label: name,
          generatedNodeId: nodeId,
          isInput: true,
          isOutput: true,
          connections: [nodeId]
        });
      }
    },

    copySourceConfig(sourceId, targetId) {
      // field helper method
      const syncFields = (srcDataset, targetDataset) => {
        const availableAtTarget = targetDataset.fields.reduce((acc, field, idx) => {
          // crude implementation can improve later
          acc[`${field.generatedNodeId}__${field.name}`] = {
            idx,
            isSource: field.connections.includes(sourceId)
          };
          return acc;
        }, {});
        srcDataset.fields
          .filter((field) => field.isOutput)
          .forEach((field) => {
            if (availableAtTarget[`${field.generatedNodeId}__${field.name}`] === undefined) {
              targetDataset.fields.push({
                ...field,
                isInput: true,
                connections: [sourceId]
              });
            } else {
              if (!availableAtTarget[`${field.generatedNodeId}__${field.name}`].isSource) {
                targetDataset.fields[availableAtTarget[`${field.generatedNodeId}__${field.name}`].idx].connections.push(
                  sourceId
                );
              }
              // update any config
              delete availableAtTarget[`${field.generatedNodeId}__${field.name}`];
            }
          });
        // delete extra fields
        targetDataset.fields = targetDataset.fields.flatMap((field) => {
          if (
            availableAtTarget[`${field.generatedNodeId}__${field.name}`] === undefined ||
            !availableAtTarget[`${field.generatedNodeId}__${field.name}`].isSource
          ) {
            return [field];
          } else {
            const idx = field.connections.find((con) => con === sourceId);
            field.connections.splice(idx, 1);
            if (!field.connections.length) return [];
            return [field];
          }
        });
      };

      const availableAtTarget = this.nodeConfigMap[targetId].availableDatasets.reduce((acc, ds, idx) => {
        acc[ds.datasetId] = {
          idx,
          isSource: ds.connections.includes(sourceId)
        };
        return acc;
      }, {});
      this.nodeConfigMap[sourceId].availableDatasets.forEach((ds) => {
        let targetds;
        if (availableAtTarget[ds.datasetId] === undefined) {
          targetds = {
            ...ds,
            fields: [],
            connections: [sourceId]
          };
          this.nodeConfigMap[targetId].availableDatasets.push(targetds);
        } else {
          if (!availableAtTarget[ds.datasetId].isSource) {
            this.nodeConfigMap[targetId].availableDatasets[availableAtTarget[ds.datasetId].idx].connections.push(
              sourceId
            );
          }
          targetds = this.nodeConfigMap[targetId].availableDatasets[availableAtTarget[ds.datasetId].idx];
          delete availableAtTarget[ds.datasetId];
        }
        //still available @ both source and target so adjust field config
        syncFields(ds, targetds);
      });

      this.nodeConfigMap[targetId].availableDatasets = this.nodeConfigMap[targetId].availableDatasets.flatMap((ds) => {
        if (availableAtTarget[ds.datasetId] === undefined || !availableAtTarget[ds.datasetId].isSource) {
          return [ds];
        } else {
          return this.removeDataset(ds, sourceId);
        }
      });
    },

    removeSourceConfig(sourceId, targetId) {
      this.nodeConfigMap[targetId].availableDatasets = this.nodeConfigMap[targetId].availableDatasets.flatMap((ds) => {
        return this.removeDataset(ds, sourceId);
      });
    },

    removeDataset(ds, sourceId) {
      const idx = ds.connections.findIndex((src) => src === sourceId);
      if (idx === -1) return [ds];
      ds.connections.splice(idx, 1);
      if (!ds.connections.length) return [];
      return [
        {
          ...ds,
          fields: ds.fields.flatMap((field) => {
            const idx = field.connections.findIndex((src) => src === sourceId);
            if (idx === -1) return [field];
            else {
              field.connections.splice(idx, 1);
              if (field.connections.length) return [field];
              else return [];
            }
          })
        }
      ];
    },

    validateNodeConfig(nodeId) {
      const operations = this.nodeConfigMap[nodeId].operations;
      const requiredFieldMap = {};
      operations.forEach((operation) => {
        operation.input.forEach((input) => {
          if (input.generatedNodeId !== nodeId) {
            if (!requiredFieldMap[input.datasetId]) {
              requiredFieldMap[input.datasetId] = {};
            }
            if (!requiredFieldMap[input.datasetId][input.field]) {
              requiredFieldMap[input.datasetId][input.field] = new Set();
            }
            requiredFieldMap[input.datasetId][input.field].add(input.generatedNodeId);
          }
        });
      });
      const availableDatasets = this.nodeConfigMap[nodeId].availableDatasets;
      availableDatasets.forEach((ds) => {
        if (requiredFieldMap[ds.datasetId]) {
          const fieldMap = requiredFieldMap[ds.datasetId];
          ds.fields.forEach((field) => {
            if (field.isInput && fieldMap[field.name]) {
              fieldMap[field.name].delete(field.generatedNodeId);
            }
          });
        }
      });
      let errors = [];
      Object.keys(requiredFieldMap).forEach((ds) => {
        Object.keys(requiredFieldMap[ds]).forEach((field) => {
          const generatedNodeIds = [...requiredFieldMap[ds][field]];
          errors = errors.concat(
            generatedNodeIds.map((generatedNodeId) => ({
              datasetId: ds,
              field,
              generatedNodeId
            }))
          );
        });
      });
      this.nodeConfigMap[nodeId].errors = errors;
    },

    logToUndoStack(param) {
      this.undoStack.push(param);
      this.redoStack = [];
    },

    executeUndoRedoAction(type) {
      if (type === 'undo' && this.undoStack.length) {
        const action = this.undoStack.pop();
        const oppositeAction = this.executeAction(action);
        this.redoStack.push(oppositeAction);
      }
      if (type === 'redo' && this.redoStack.length) {
        const action = this.redoStack.pop();
        const oppositeAction = this.executeAction(action);
        this.undoStack.push(oppositeAction);
      }
    },

    executeAction(action) {
      const { removeNodes, addNodes, addEdges, findNode, removeEdges } = useVueFlow({
        id: 'zval-flow'
      });
      switch (action.type) {
        case 'nodeAdded': {
          // if (action.nodeConfig) {
          //   this.nodeConfigMap[action.node.id] = action.nodeConfig;
          // }
          action.nodeConfig = this.nodeConfigMap[action.node.id];
          removeNodes([action.node]);
          return this.generateOppositeAction(action);
        }
        case 'nodeRemoved': {
          if (action.nodeConfig) {
            this.nodeConfigMap[action.node.id] = action.nodeConfig;
          }
          addNodes([action.node]);
          return this.generateOppositeAction(action);
        }
        case 'nodeMoved': {
          const node = findNode(action.nodeId);
          node.position = action.oldPosition;
          return this.generateOppositeAction(action);
        }
        case 'edgeAdded': {
          removeEdges([action.edge]);
          return this.generateOppositeAction(action);
        }
        case 'edgeRemoved': {
          addEdges([action.edge]);
          return this.generateOppositeAction(action);
        }
      }
    },

    generateOppositeAction(action) {
      switch (action.type) {
        case 'nodeAdded': {
          return {
            type: 'nodeRemoved',
            node: action.node,
            nodeConfig: action.nodeConfig
          };
        }
        case 'nodeRemoved': {
          return {
            type: 'nodeAdded',
            node: action.node,
            nodeConfig: action.nodeConfig
          };
        }
        case 'nodeMoved': {
          return {
            type: 'nodeMoved',
            nodeId: action.nodeId,
            oldPosition: action.newPosition,
            newPosition: action.oldPosition
          };
        }
        case 'edgeAdded': {
          return {
            type: 'edgeRemoved',
            edge: action.edge
          };
        }
        case 'edgeRemoved': {
          return {
            type: 'edgeAdded',
            edge: action.edge
          };
        }
      }
    }
  }
});
