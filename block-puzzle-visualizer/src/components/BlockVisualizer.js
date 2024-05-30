import React, { useEffect, useRef, useState } from 'react';
import * as THREE from 'three';
import { OrbitControls } from 'three/examples/jsm/controls/OrbitControls';
import './BlockVisualizer.css';

const BlockVisualizer = ({ blockData }) => {
    const mountRef = useRef(null); // Reference to the mounting point of the Three.js canvas
    const [spacing, setSpacing] = useState(1); // State for controlling the spacing between blocks
    const [enableRotation, setEnableRotation] = useState(true); // State for enabling/disabling rotation
    const [enableZoom, setEnableZoom] = useState(true); // State for enabling/disabling zoom
    const controls = useRef(null); // Reference to the orbit controls
    const pieceColors = useRef([]); // Array to store colors for each piece
    const pieceGroups = useRef([]); // Array to store groups of blocks representing each piece
    const sceneRef = useRef(null); // Reference to the Three.js scene
    const cameraRef = useRef(null); // Reference to the camera
    const rendererRef = useRef(null); // Reference to the renderer

    const initializeScene = () => {
        // Create the Three.js scene
        sceneRef.current = new THREE.Scene();

        // Create and set up the camera
        cameraRef.current = new THREE.PerspectiveCamera(75, window.innerWidth / window.innerHeight, 0.1, 1000);
        rendererRef.current = new THREE.WebGLRenderer();
        rendererRef.current.setSize(window.innerWidth, window.innerHeight);

        // Append the renderer canvas to the DOM
        mountRef.current.appendChild(rendererRef.current.domElement);

        // Set up orbit controls for camera manipulation
        controls.current = new OrbitControls(cameraRef.current, rendererRef.current.domElement);
        controls.current.enableZoom = enableZoom;
        controls.current.enableRotate = enableRotation;

        // Add ambient light to the scene
        const ambientLight = new THREE.AmbientLight(0xffffff, 0.8);
        sceneRef.current.add(ambientLight);

        // Add directional light to the scene
        const directionalLight = new THREE.DirectionalLight(0xffffff, 1.0);
        directionalLight.position.set(1, 1, 1).normalize();
        sceneRef.current.add(directionalLight);

        // Position the camera
        cameraRef.current.position.z = 10;
    };

    useEffect(() => {
        // Initialize the scene when the component mounts
        initializeScene();

        // Function to parse block data from string to array of numbers
        const parseBlockData = (data) => {
            const lines = data.trim().split('\n');
            return lines.map(line => line.trim().split(/\s+/).map(Number));
        };

        // Parse the input block data
        const blockPositions = parseBlockData(blockData);

        // Assign colors to each piece once
        if (pieceColors.current.length === 0) {
            blockPositions.forEach(() => {
                pieceColors.current.push(new THREE.Color(Math.random(), Math.random(), Math.random()));
            });
        }

        const createBlocks = () => {
            // Remove previous groups from the scene
            pieceGroups.current.forEach(group => sceneRef.current.remove(group.group));
            pieceGroups.current = [];

            // Create new groups of blocks for each piece
            blockPositions.forEach((positions, index) => {
                const color = pieceColors.current[index];
                const group = new THREE.Group();

                // Create individual blocks for each position
                for (let i = 0; i < positions.length; i += 3) {
                    const [x, y, z] = positions.slice(i, i + 3);
                    const geometry = new THREE.BoxGeometry();
                    const material = new THREE.MeshStandardMaterial({ color, roughness: 0.3, metalness: 0.5 });
                    const block = new THREE.Mesh(geometry, material);
                    block.position.set(x, y, z); // Set position without spacing
                    group.add(block);
                }

                // Add the group to the scene and store it
                sceneRef.current.add(group);
                pieceGroups.current.push({ group, originalPositions: positions });
            });
        };

        // Create the blocks when the component mounts
        createBlocks();

        // Animation loop
        const animate = () => {
            requestAnimationFrame(animate);
            rendererRef.current.render(sceneRef.current, cameraRef.current);
            if (enableRotation) {
                controls.current.update();
            }
        };

        // Start the animation
        animate();

        // Cleanup function
        return () => {
            if (mountRef.current) {
                mountRef.current.removeChild(rendererRef.current.domElement);
            }
            controls.current.dispose();
        };
    }, [blockData]);

    // Update rotation enable state
    useEffect(() => {
        controls.current.enableRotate = enableRotation;
    }, [enableRotation]);

    // Update zoom enable state
    useEffect(() => {
        controls.current.enableZoom = enableZoom;
    }, [enableZoom]);

    // Update block spacing
    useEffect(() => {
        // Calculate center of all groups
        const center = new THREE.Vector3();
        pieceGroups.current.forEach(({ group }) => {
            center.add(group.position);
        });
        center.divideScalar(pieceGroups.current.length);

        // Adjust positions of each group based on new spacing
        pieceGroups.current.forEach(({ group, originalPositions }) => {
            group.position.set(0, 0, 0); // Reset position

            const groupCenter = new THREE.Vector3();
            for (let i = 0; i < originalPositions.length; i += 3) {
                const [x, y, z] = originalPositions.slice(i, i + 3);
                groupCenter.add(new THREE.Vector3(x, y, z));
            }
            groupCenter.divideScalar(originalPositions.length / 3);
            const offset = new THREE.Vector3().subVectors(groupCenter, center).multiplyScalar(spacing - 1);
            group.position.add(offset);
        });
    }, [spacing]);

    // Handle spacing change event
    const handleSpacingChange = (e) => {
        setSpacing(parseFloat(e.target.value));
    };

    // Handle rotation enable/disable event
    const handleRotationChange = (e) => {
        setEnableRotation(e.target.checked);
    };

    // Handle zoom enable/disable event
    const handleZoomChange = (e) => {
        setEnableZoom(e.target.checked);
    };

    return (
        <div className="App">
            <header className="App-header">
                <h1>3D Block Puzzle Visualizer</h1>
                <div className="BlockVisualizer">
                    <div className="controls-container">
                        <div className="slider-container">
                            <input
                                type="range"
                                min="1"
                                max="2"
                                value={spacing}
                                onChange={handleSpacingChange}
                                step="0.05"
                                style={{ width: "100px", background: "black", color: "white" }}
                            />
                            <label style={{ color: "white" }}>Spacing: {spacing}</label>
                        </div>

                        <div className="checkbox-container">
                            <input
                                type="checkbox"
                                id="rotationCheckbox"
                                checked={enableRotation}
                                onChange={handleRotationChange}
                            />
                            <label htmlFor="rotationCheckbox" style={{ color: "white" }}>Enable Rotation</label>
                        </div>

                        <div className="checkbox-container">
                            <input
                                type="checkbox"
                                id="zoomCheckbox"
                                checked={enableZoom}
                                onChange={handleZoomChange}
                            />
                            <label htmlFor="zoomCheckbox" style={{ color: "white" }}>Enable Zoom</label>
                        </div>
                    </div>
                    <div ref={mountRef} className="visualization-container" />
                </div>
            </header>
        </div>
    );
};

export default BlockVisualizer;
