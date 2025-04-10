import { useState, useEffect } from "react";
import "./App.css";

export default function NeuralNetworkDemo() {
  const [inputs, setInputs] = useState(2);
  const [hiddenLayers, setHiddenLayers] = useState(1);
  const [neuronsPerHiddenLayer, setNeuronsPerHiddenLayer] = useState(3);
  const [outputs, setOutputs] = useState(1);
  const [inputValues, setInputValues] = useState([0.5, 0.8]);
  const [weights, setWeights] = useState({});
  const [neuronOutputs, setNeuronOutputs] = useState({});
  const [showWeights, setShowWeights] = useState(false);

  // Initialize weights with random values
  useEffect(() => {
    const newWeights = {};
    const newOutputs = { input: Array(inputs).fill(0) };

    // Input to first hidden layer
    newWeights["input-hidden0"] = Array(inputs)
      .fill()
      .map(() =>
        Array(neuronsPerHiddenLayer)
          .fill()
          .map(() => (Math.random() * 2 - 1).toFixed(2)),
      );

    // Between hidden layers
    for (let i = 0; i < hiddenLayers - 1; i++) {
      newWeights[`hidden${i}-hidden${i + 1}`] = Array(neuronsPerHiddenLayer)
        .fill()
        .map(() =>
          Array(neuronsPerHiddenLayer)
            .fill()
            .map(() => (Math.random() * 2 - 1).toFixed(2)),
        );
      newOutputs[`hidden${i}`] = Array(neuronsPerHiddenLayer).fill(0);
    }

    // Last hidden layer to output
    newWeights[`hidden${hiddenLayers - 1}-output`] = Array(
      neuronsPerHiddenLayer,
    )
      .fill()
      .map(() =>
        Array(outputs)
          .fill()
          .map(() => (Math.random() * 2 - 1).toFixed(2)),
      );

    newOutputs[`hidden${hiddenLayers - 1}`] = Array(neuronsPerHiddenLayer).fill(
      0,
    );
    newOutputs["output"] = Array(outputs).fill(0);

    setWeights(newWeights);
    setNeuronOutputs(newOutputs);

    // Update input values array size
    setInputValues((prev) => {
      const newInputs = [...prev];
      while (newInputs.length < inputs) {
        newInputs.push(0.5);
      }
      return newInputs.slice(0, inputs);
    });
  }, [inputs, hiddenLayers, neuronsPerHiddenLayer, outputs]);

  // Sigmoid activation function
  const sigmoid = (x) => 1 / (1 + Math.exp(-x));

  // Forward pass computation - This is where the network calculates outputs based on input values
  useEffect(() => {
    // Don't proceed if weights aren't initialized yet
    if (Object.keys(weights).length === 0) return;

    const newOutputs = { ...neuronOutputs };

    // Set input layer values
    newOutputs["input"] = [...inputValues];

    try {
      // Input to first hidden layer
      const inputToHidden = weights["input-hidden0"];
      if (!inputToHidden) return; // Safety check

      for (let j = 0; j < neuronsPerHiddenLayer; j++) {
        let sum = 0;
        for (let i = 0; i < inputs; i++) {
          // Check if both values exist before using them
          if (inputToHidden[i] && inputToHidden[i][j] !== undefined) {
            sum += inputValues[i] * parseFloat(inputToHidden[i][j]);
          }
        }
        if (!newOutputs["hidden0"]) {
          newOutputs["hidden0"] = Array(neuronsPerHiddenLayer).fill(0);
        }
        newOutputs["hidden0"][j] = sigmoid(sum);
      }

      // Between hidden layers
      for (let layer = 1; layer < hiddenLayers; layer++) {
        const prevLayerOutputs = newOutputs[`hidden${layer - 1}`];
        const layerWeights = weights[`hidden${layer - 1}-hidden${layer}`];

        if (!layerWeights) continue; // Safety check

        if (!newOutputs[`hidden${layer}`]) {
          newOutputs[`hidden${layer}`] = Array(neuronsPerHiddenLayer).fill(0);
        }

        for (let j = 0; j < neuronsPerHiddenLayer; j++) {
          let sum = 0;
          for (let i = 0; i < neuronsPerHiddenLayer; i++) {
            if (layerWeights[i] && layerWeights[i][j] !== undefined) {
              sum += prevLayerOutputs[i] * parseFloat(layerWeights[i][j]);
            }
          }
          newOutputs[`hidden${layer}`][j] = sigmoid(sum);
        }
      }

      // Last hidden layer to output
      const lastHiddenOutputs = newOutputs[`hidden${hiddenLayers - 1}`];
      const outputWeights = weights[`hidden${hiddenLayers - 1}-output`];

      if (!outputWeights) return; // Safety check

      for (let j = 0; j < outputs; j++) {
        let sum = 0;
        for (let i = 0; i < neuronsPerHiddenLayer; i++) {
          if (outputWeights[i] && outputWeights[i][j] !== undefined) {
            sum += lastHiddenOutputs[i] * parseFloat(outputWeights[i][j]);
          }
        }
        newOutputs["output"][j] = sigmoid(sum);
      }

      setNeuronOutputs(newOutputs);
    } catch (error) {
      console.error("Error in neural network calculation:", error);
    }
  }, [
    inputValues,
    weights,
    inputs,
    hiddenLayers,
    neuronsPerHiddenLayer,
    outputs,
    neuronOutputs,
  ]);

  // Handle input value changes
  const handleInputChange = (index, value) => {
    const newValues = [...inputValues];
    newValues[index] = parseFloat(value);
    setInputValues(newValues);
  };

  // Generate random weights
  const randomizeWeights = () => {
    // Don't proceed if weights aren't initialized yet
    if (Object.keys(weights).length === 0) return;

    const newWeights = {};

    // Input to first hidden layer
    newWeights["input-hidden0"] = weights["input-hidden0"].map((row) =>
      row.map(() => (Math.random() * 2 - 1).toFixed(2)),
    );

    // Between hidden layers
    for (let i = 0; i < hiddenLayers - 1; i++) {
      if (weights[`hidden${i}-hidden${i + 1}`]) {
        newWeights[`hidden${i}-hidden${i + 1}`] = weights[
          `hidden${i}-hidden${i + 1}`
        ].map((row) => row.map(() => (Math.random() * 2 - 1).toFixed(2)));
      }
    }

    // Last hidden layer to output
    newWeights[`hidden${hiddenLayers - 1}-output`] = weights[
      `hidden${hiddenLayers - 1}-output`
    ].map((row) => row.map(() => (Math.random() * 2 - 1).toFixed(2)));

    setWeights(newWeights);
  };

  // Network structure constants
  // const layerWidth = 100;
  const nodeRadius = 18;
  const layerGap = 150;
  const nodeGap = 50;
  const startX = 100;
  const startY = 200;

  // Calculate positions for all nodes
  const getNodePositions = () => {
    const positions = {};

    // Input layer
    positions["input"] = Array(inputs)
      .fill()
      .map((_, i) => ({
        x: startX,
        y: startY + i * nodeGap - ((inputs - 1) * nodeGap) / 2,
      }));

    // Hidden layers
    for (let l = 0; l < hiddenLayers; l++) {
      positions[`hidden${l}`] = Array(neuronsPerHiddenLayer)
        .fill()
        .map((_, i) => ({
          x: startX + layerGap * (l + 1),
          y: startY + i * nodeGap - ((neuronsPerHiddenLayer - 1) * nodeGap) / 2,
        }));
    }

    // Output layer
    positions["output"] = Array(outputs)
      .fill()
      .map((_, i) => ({
        x: startX + layerGap * (hiddenLayers + 1),
        y: startY + i * nodeGap - ((outputs - 1) * nodeGap) / 2,
      }));

    return positions;
  };

  const nodePositions = getNodePositions();

  // Calculate all edge paths
  const getEdgePaths = () => {
    if (Object.keys(weights).length === 0) return [];

    const edges = [];

    try {
      // Input to first hidden layer
      if (weights["input-hidden0"]) {
        for (let i = 0; i < inputs; i++) {
          for (let j = 0; j < neuronsPerHiddenLayer; j++) {
            if (
              weights["input-hidden0"][i] &&
              weights["input-hidden0"][i][j] !== undefined
            ) {
              const weight = weights["input-hidden0"][i][j];
              const sourceOutput = neuronOutputs["input"]?.[i] || 0;
              const value = Math.abs(parseFloat(weight) * sourceOutput);

              edges.push({
                from: nodePositions["input"][i],
                to: nodePositions["hidden0"][j],
                weight: parseFloat(weight),
                value: value,
                id: `input${i}-hidden0${j}`,
              });
            }
          }
        }
      }

      // Between hidden layers
      for (let l = 0; l < hiddenLayers - 1; l++) {
        const layerWeights = weights[`hidden${l}-hidden${l + 1}`];
        if (!layerWeights) continue;

        for (let i = 0; i < neuronsPerHiddenLayer; i++) {
          for (let j = 0; j < neuronsPerHiddenLayer; j++) {
            if (layerWeights[i] && layerWeights[i][j] !== undefined) {
              const weight = layerWeights[i][j];
              const sourceOutput = neuronOutputs[`hidden${l}`]?.[i] || 0;
              const value = Math.abs(parseFloat(weight) * sourceOutput);

              edges.push({
                from: nodePositions[`hidden${l}`][i],
                to: nodePositions[`hidden${l + 1}`][j],
                weight: parseFloat(weight),
                value: value,
                id: `hidden${l}${i}-hidden${l + 1}${j}`,
              });
            }
          }
        }
      }

      // Last hidden layer to output
      const outputWeights = weights[`hidden${hiddenLayers - 1}-output`];
      if (outputWeights) {
        for (let i = 0; i < neuronsPerHiddenLayer; i++) {
          for (let j = 0; j < outputs; j++) {
            if (outputWeights[i] && outputWeights[i][j] !== undefined) {
              const weight = outputWeights[i][j];
              const sourceOutput =
                neuronOutputs[`hidden${hiddenLayers - 1}`]?.[i] || 0;
              const value = Math.abs(parseFloat(weight) * sourceOutput);

              edges.push({
                from: nodePositions[`hidden${hiddenLayers - 1}`][i],
                to: nodePositions["output"][j],
                weight: parseFloat(weight),
                value: value,
                id: `hidden${hiddenLayers - 1}${i}-output${j}`,
              });
            }
          }
        }
      }
    } catch (error) {
      console.error("Error generating edges:", error);
    }

    return edges;
  };

  const edges = getEdgePaths();

  // Get node color based on activation value
  const getNodeColor = (value) => {
    // From blue (cold/0) to red (hot/1)
    const r = Math.floor(value * 255);
    const g = Math.floor(128 - Math.abs(128 - value * 255));
    const b = Math.floor(255 - value * 255);
    return `rgb(${r}, ${g}, ${b})`;
  };

  // Get stroke color for connections based on weight
  const getEdgeColor = (weight) => {
    if (weight > 0) return "rgba(0, 200, 0, 0.6)"; // Green for positive
    return "rgba(255, 0, 0, 0.6)"; // Red for negative
  };

  return (
    <div className="neural-network-container">
      <div className="controls-panel">
        <h1 className="title">Interactive Neural Network</h1>

        <div className="slider-controls">
          <div className="control-item">
            <label>Input Neurons</label>
            <input
              type="range"
              min="1"
              max="7"
              value={inputs}
              onChange={(e) => setInputs(parseInt(e.target.value))}
            />
            <span className="value-display">{inputs}</span>
          </div>

          <div className="control-item">
            <label>Hidden Layers</label>
            <input
              type="range"
              min="1"
              max="7"
              value={hiddenLayers}
              onChange={(e) => setHiddenLayers(parseInt(e.target.value))}
            />
            <span className="value-display">{hiddenLayers}</span>
          </div>

          <div className="control-item">
            <label>Neurons per Hidden Layer</label>
            <input
              type="range"
              min="1"
              max="7"
              value={neuronsPerHiddenLayer}
              onChange={(e) =>
                setNeuronsPerHiddenLayer(parseInt(e.target.value))
              }
            />
            <span className="value-display">{neuronsPerHiddenLayer}</span>
          </div>

          <div className="control-item">
            <label>Output Neurons</label>
            <input
              type="range"
              min="1"
              max="7"
              value={outputs}
              onChange={(e) => setOutputs(parseInt(e.target.value))}
            />
            <span className="value-display">{outputs}</span>
          </div>
        </div>

        <div className="action-controls">
          <button onClick={randomizeWeights} className="randomize-button">
            Randomize Weights
          </button>

          <label className="weight-toggle">
            <input
              type="checkbox"
              checked={showWeights}
              onChange={() => setShowWeights(!showWeights)}
            />
            Show Weights
          </label>
        </div>
      </div>

      <div className="values-container">
        <div className="input-values-panel">
          <h2>Input Values</h2>
          <div className="input-values-list">
            {inputValues.map((value, i) => (
              <div key={`input-${i}`} className="input-value-item">
                <label>Input {i + 1}:</label>
                <input
                  type="range"
                  min="0"
                  max="1"
                  step="0.01"
                  value={value}
                  onChange={(e) => handleInputChange(i, e.target.value)}
                />
                <span className="value-display">{value.toFixed(2)}</span>
              </div>
            ))}
          </div>
        </div>

        <div className="output-values-panel">
          <h2>Output Values</h2>
          <div className="output-values-list">
            {neuronOutputs["output"]?.map((value, i) => (
              <div key={`output-${i}`} className="output-value-item">
                <span>Output {i + 1}:</span>
                <div className="output-bar-container">
                  <div
                    className="output-bar"
                    style={{
                      width: `${value * 100}%`,
                      backgroundColor: getNodeColor(value),
                    }}
                  ></div>
                </div>
                <span className="value-display">{value.toFixed(3)}</span>
              </div>
            ))}
          </div>
        </div>
      </div>

      <div className="network-visualization">
        <svg width="100%" height="400" className="network-svg">
          {/* Edges between nodes */}
          {edges.map((edge) => {
            const strokeWidth = edge.value * 5 + 0.5;
            return (
              <g key={edge.id}>
                <line
                  x1={edge.from.x}
                  y1={edge.from.y}
                  x2={edge.to.x}
                  y2={edge.to.y}
                  stroke={getEdgeColor(edge.weight)}
                  strokeWidth={strokeWidth}
                  strokeOpacity="0.8"
                />

                {showWeights && (
                  <text
                    x={(edge.from.x + edge.to.x) / 2}
                    y={(edge.from.y + edge.to.y) / 2 - 5}
                    textAnchor="middle"
                    fontSize="10"
                    fill={edge.weight >= 0 ? "green" : "red"}
                  >
                    {edge.weight.toFixed(2)}
                  </text>
                )}
              </g>
            );
          })}

          {/* Input nodes */}
          {nodePositions["input"]?.map((pos, i) => (
            <g key={`input-${i}`}>
              <circle
                cx={pos.x}
                cy={pos.y}
                r={nodeRadius}
                fill={getNodeColor(neuronOutputs["input"]?.[i] || 0)}
                stroke="#333"
                strokeWidth="1"
              />
              <text
                x={pos.x}
                y={pos.y}
                textAnchor="middle"
                dominantBaseline="middle"
                fontSize="12"
                fill="white"
              >
                {neuronOutputs["input"]?.[i]?.toFixed(2) || "0"}
              </text>
              <text
                x={pos.x}
                y={pos.y + nodeRadius + 15}
                textAnchor="middle"
                fontSize="10"
                fill="#333"
              >
                In {i + 1}
              </text>
            </g>
          ))}

          {/* Hidden layer nodes */}
          {Array.from({ length: hiddenLayers }).map((_, l) =>
            nodePositions[`hidden${l}`]?.map((pos, i) => (
              <g key={`hidden${l}-${i}`}>
                <circle
                  cx={pos.x}
                  cy={pos.y}
                  r={nodeRadius}
                  fill={getNodeColor(neuronOutputs[`hidden${l}`]?.[i] || 0)}
                  stroke="#333"
                  strokeWidth="1"
                />
                <text
                  x={pos.x}
                  y={pos.y}
                  textAnchor="middle"
                  dominantBaseline="middle"
                  fontSize="12"
                  fill="white"
                >
                  {neuronOutputs[`hidden${l}`]?.[i]?.toFixed(2) || "0"}
                </text>
                <text
                  x={pos.x}
                  y={pos.y + nodeRadius + 15}
                  textAnchor="middle"
                  fontSize="10"
                  fill="#333"
                >
                  H{l + 1},{i + 1}
                </text>
              </g>
            )),
          )}

          {/* Output nodes */}
          {nodePositions["output"]?.map((pos, i) => (
            <g key={`output-${i}`}>
              <circle
                cx={pos.x}
                cy={pos.y}
                r={nodeRadius}
                fill={getNodeColor(neuronOutputs["output"]?.[i] || 0)}
                stroke="#333"
                strokeWidth="1"
              />
              <text
                x={pos.x}
                y={pos.y}
                textAnchor="middle"
                dominantBaseline="middle"
                fontSize="12"
                fill="white"
              >
                {neuronOutputs["output"]?.[i]?.toFixed(2) || "0"}
              </text>
              <text
                x={pos.x}
                y={pos.y + nodeRadius + 15}
                textAnchor="middle"
                fontSize="10"
                fill="#333"
              >
                Out {i + 1}
              </text>
            </g>
          ))}

          {/* Layer labels */}
          <text
            x={startX}
            y={30}
            textAnchor="middle"
            fontSize="14"
            fontWeight="bold"
            fill="#333"
          >
            Input Layer
          </text>

          {Array.from({ length: hiddenLayers }).map((_, l) => (
            <text
              key={`layer-label-${l}`}
              x={startX + layerGap * (l + 1)}
              y={30}
              textAnchor="middle"
              fontSize="14"
              fontWeight="bold"
              fill="#333"
            >
              Hidden Layer {l + 1}
            </text>
          ))}

          <text
            x={startX + layerGap * (hiddenLayers + 1)}
            y={30}
            textAnchor="middle"
            fontSize="14"
            fontWeight="bold"
            fill="#333"
          >
            Output Layer
          </text>
        </svg>
      </div>

      <div className="info-panel">
        <p>
          <span>Explore the Interactive Demo:</span>
          <br />
          &nbsp;&nbsp;This demo visualizes the{" "}
          <span>Sigmoid Activation Function</span> in action.
          <br />
          <br />
          <span style={{ color: "#16a085" }}>Node Colors</span> represent the
          activation levels: <span style={{ color: "#3498db" }}>Blue</span>{" "}
          indicates low activity, &nbsp;
          <span style={{ color: "#e74c3c" }}>Red</span> indicates high activity.
          <br />
          <span style={{ color: "#16a085" }}>Connection Line Thickness</span>
          &nbsp; corresponds to the signal strength, calculated as
          <span style={{ fontWeight: "bold" }}>&nbsp;Weight × Input Value</span>
          . The lines' colors also indicate the weight's sign: &nbsp;
          <span style={{ color: "#2ecc71" }}>Green</span> for positive, &nbsp;
          <span style={{ color: "#e74c3c" }}>Red</span> for negative.
        </p>
      </div>
    </div>
  );
}
