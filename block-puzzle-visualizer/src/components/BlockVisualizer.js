import React, { useEffect, useRef, useState } from 'react';
import * as THREE from 'three';
import { OrbitControls } from 'three/examples/jsm/controls/OrbitControls';
import './BlockVisualizer.css';

const BlockVisualizer = ({ blockData }) => {
    // References and state variables
    const mountRef = useRef(null); // Ref to the mount point of the Three.js canvas
    const [spacing, setSpacing] = useState(1); // State for spacing between blocks
    const [enableRotation, setEnableRotation] = useState(true); // State to enable/disable rotation
    const [enableZoom, setEnableZoom] = useState(true); // State to enable/disable zoom
    const controls = useRef(null); // Ref to OrbitControls
    const pieceColors = useRef([]); // Ref to store colors of each piece
    const pieceGroups = useRef([]); // Ref to store groups of blocks representing each piece
    const sceneRef = useRef(null); // Ref to the Three.js scene
    const cameraRef = useRef(null); // Ref to the camera
    const rendererRef = useRef(null); // Ref to the renderer

    // Function to initialize the scene
    const initializeScene = () => {
        sceneRef.current = new THREE.Scene();

        // Set up camera
        cameraRef.current = new THREE.PerspectiveCamera(75, window.innerWidth / window.innerHeight, 0.1, 1000);
        rendererRef.current = new THREE.WebGLRenderer();
        rendererRef.current.setSize(window.innerWidth, window.innerHeight);
        mountRef.current.appendChild(rendererRef.current.domElement);

        // Set up orbit controls
        controls.current = new OrbitControls(cameraRef.current, rendererRef.current.domElement);
        controls.current.enableZoom = enableZoom;
        controls.current.enableRotate = enableRotation;

        // Add ambient and directional lights
        const ambientLight = new THREE.AmbientLight(0xffffff, 0.8);
        sceneRef.current.add(ambientLight);
        const directionalLight = new THREE.DirectionalLight(0xffffff, 1.0);
        directionalLight.position.set(1, 1, 1).normalize();
        sceneRef.current.add(directionalLight);

        // Position the camera
        cameraRef.current.position.z = 10;
    };

    useEffect(() => {
        initializeScene();

        // Parse block data from string to array of numbers
        const parseBlockData = (data) => {
            const lines = data.trim().split('\n');
            return lines.map(line => line.trim().split(/\s+/).map(Number));
        };

        const blockPositions = parseBlockData(blockData);

        // Assign random colors to each piece
        if (pieceColors.current.length === 0) {
            blockPositions.forEach(() => {
                pieceColors.current.push(new THREE.Color(Math.random(), Math.random(), Math.random()));
            });
        }

        // Function to create blocks and add them to the scene
        const createBlocks = () => {
            // Remove previous groups from the scene
            pieceGroups.current.forEach(group => sceneRef.current.remove(group.group));
            pieceGroups.current = [];

            blockPositions.forEach((positions, index) => {
                const color = pieceColors.current[index];
                const group = new THREE.Group();
                const center = new THREE.Vector3();
                const count = positions.length / 3;

                // Calculate center of the group
                for (let i = 0; i < positions.length; i += 3) {
                    const [x, y, z] = positions.slice(i, i + 3);
                    center.add(new THREE.Vector3(x, y, z));
                }
                center.divideScalar(count);

                // Create individual blocks and add them to the group
                for (let i = 0; i < positions.length; i += 3) {
                    const [x, y, z] = positions.slice(i, i + 3);
                    const geometry = new THREE.BoxGeometry();
                    const material = new THREE.MeshStandardMaterial({ color, roughness: 0.3, metalness: 0.5 });
                    const block = new THREE.Mesh(geometry, material);
                    block.position.set(x - center.x, y - center.y, z - center.z);
                    group.add(block);
                }

                // Add the group to the scene and store it
                sceneRef.current.add(group);
                pieceGroups.current.push({ group, originalPositions: positions, center });
            });
        };

        createBlocks();

        // Animation loop
        const animate = () => {
            requestAnimationFrame(animate);
            rendererRef.current.render(sceneRef.current, cameraRef.current);
            if (enableRotation) {
                controls.current.update();
            }
        };

        animate();

        // Cleanup on component unmount
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
        pieceGroups.current.forEach(({ group, center: groupCenter }) => {
            center.add(groupCenter);
        });
        center.divideScalar(pieceGroups.current.length);

        // Create a scaling matrix
        const scalingMatrix = new THREE.Matrix4().makeScale(spacing, spacing, spacing);

        // Adjust positions of each group based on new spacing
        pieceGroups.current.forEach(({ group, center: groupCenter }) => {
            const offset = new THREE.Vector3().subVectors(groupCenter, center).applyMatrix4(scalingMatrix);
            group.position.copy(offset);
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
                                max="3"
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
