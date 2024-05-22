import React, { useEffect, useRef, useState } from 'react';
import * as THREE from 'three';
import { OrbitControls } from 'three/examples/jsm/controls/OrbitControls';
import './BlockVisualizer.css';

const BlockVisualizer = ({ blockData }) => {
    const mountRef = useRef(null);
    const [spacing, setSpacing] = useState(1); // initial spacing
    const [enableRotation, setEnableRotation] = useState(true);
    const [enableZoom, setEnableZoom] = useState(true);
    const controls = useRef(null);
    const pieceColors = useRef([]);
    const pieceGroups = useRef([]);
    const sceneRef = useRef(null);
    const cameraRef = useRef(null);
    const rendererRef = useRef(null);

    const initializeScene = () => {
        sceneRef.current = new THREE.Scene();
        cameraRef.current = new THREE.PerspectiveCamera(75, window.innerWidth / window.innerHeight, 0.1, 1000);
        rendererRef.current = new THREE.WebGLRenderer();
        rendererRef.current.setSize(window.innerWidth, window.innerHeight);
        mountRef.current.appendChild(rendererRef.current.domElement);

        controls.current = new OrbitControls(cameraRef.current, rendererRef.current.domElement);
        controls.current.enableZoom = enableZoom;
        controls.current.enableRotate = enableRotation;

        const ambientLight = new THREE.AmbientLight(0xffffff, 0.5);
        sceneRef.current.add(ambientLight);

        const directionalLight = new THREE.DirectionalLight(0xffffff, 0.5);
        directionalLight.position.set(1, 1, 1).normalize();
        sceneRef.current.add(directionalLight);

        cameraRef.current.position.z = 10;
    };

    useEffect(() => {
        initializeScene();
        
        const parseBlockData = (data) => {
            const lines = data.trim().split('\n');
            return lines.map(line => line.trim().split(/\s+/).map(Number));
        };

        const blockPositions = parseBlockData(blockData);

        // Assign colors to each piece once
        if (pieceColors.current.length === 0) {
            blockPositions.forEach(() => {
                pieceColors.current.push(new THREE.Color(Math.random(), Math.random(), Math.random()));
            });
        }

        const createBlocks = () => {
            pieceGroups.current.forEach(group => sceneRef.current.remove(group.group));
            pieceGroups.current = [];

            blockPositions.forEach((positions, index) => {
                const color = pieceColors.current[index];
                const group = new THREE.Group();

                for (let i = 0; i < positions.length; i += 3) {
                    const [x, y, z] = positions.slice(i, i + 3);
                    const geometry = new THREE.BoxGeometry();
                    const material = new THREE.MeshPhongMaterial({ color, specular: 0x111111, shininess: 200 });
                    const block = new THREE.Mesh(geometry, material);
                    block.position.set(x, y, z); // Set position without spacing
                    group.add(block);
                }

                sceneRef.current.add(group);
                pieceGroups.current.push({ group, originalPositions: positions });
            });
        };

        createBlocks();

        const animate = () => {
            requestAnimationFrame(animate);
            rendererRef.current.render(sceneRef.current, cameraRef.current);
            if (enableRotation) {
                controls.current.update();
            }
        };

        animate();

        return () => {
            if (mountRef.current) {
                mountRef.current.removeChild(rendererRef.current.domElement);
            }
            controls.current.dispose();
        };
    }, [blockData]);

    useEffect(() => {
        controls.current.enableRotate = enableRotation;
    }, [enableRotation]);

    useEffect(() => {
        controls.current.enableZoom = enableZoom;
    }, [enableZoom]);

    useEffect(() => {
        // Update spacing without recreating blocks
        const center = new THREE.Vector3();
        pieceGroups.current.forEach(({ group }) => {
            center.add(group.position);
        });
        center.divideScalar(pieceGroups.current.length);

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

    const handleSpacingChange = (e) => {
        setSpacing(parseFloat(e.target.value));
    };

    const handleRotationChange = (e) => {
        setEnableRotation(e.target.checked);
    };

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
}

export default BlockVisualizer;