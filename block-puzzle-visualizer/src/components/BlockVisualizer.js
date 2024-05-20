import React, { useEffect, useRef, useState } from 'react';
import * as THREE from 'three';
import { OrbitControls } from 'three/examples/jsm/controls/OrbitControls';

const BlockVisualizer = ({ blockData }) => {
    const mountRef = useRef(null);
    const [spacing, setSpacing] = useState(1); // initial spacing
    const [enableZoom, setEnableZoom] = useState(true); // enable zoom flag
    const [enableRotation, setEnableRotation] = useState(true); // enable rotation flag
    const blocks = useRef([]);
    const controls = useRef(null);
    const sceneCenter = useRef(new THREE.Vector3());
    const cameraOffset = useRef(new THREE.Vector3());

    useEffect(() => {
        const scene = new THREE.Scene();
        const camera = new THREE.PerspectiveCamera(75, window.innerWidth / window.innerHeight, 0.1, 1000);
        const renderer = new THREE.WebGLRenderer();
        renderer.setSize(window.innerWidth, window.innerHeight);
        mountRef.current.appendChild(renderer.domElement);

        controls.current = new OrbitControls(camera, renderer.domElement);
        controls.current.enableZoom = enableZoom; // Enable/disable zoom based on flag
        controls.current.enableRotate = enableRotation; // Enable/disable rotation based on flag

        const parseBlockData = (data) => {
            const lines = data.trim().split('\n');
            return lines.map(line => line.trim().split(/\s+/).map(Number));
        };

        const blockPositions = parseBlockData(blockData);

        const createBlocks = () => {
            blocks.current.forEach(block => scene.remove(block));
            blocks.current = [];

            blockPositions.forEach((positions, index) => {
                for (let i = 0; i < positions.length; i += 3) {
                    const [x, y, z] = positions.slice(i, i + 3);
                    const geometry = new THREE.BoxGeometry();
                    const material = new THREE.MeshBasicMaterial({ color: getRandomColor() });
                    const block = new THREE.Mesh(geometry, material);
                    block.position.set(x * spacing, y * spacing, z * spacing);
                    scene.add(block);
                    blocks.current.push(block);
                }
            });

            // Calculate scene center
            const box = new THREE.Box3().setFromObject(scene);
            box.getCenter(sceneCenter.current);
        };

        const getRandomColor = () => {
            const color = Math.random() * 0xffffff;
            return color;
        };

        createBlocks();

        camera.position.z = 10;

        // Calculate camera offset from scene center
        cameraOffset.current.copy(camera.position).sub(sceneCenter.current);

        const animate = () => {
            requestAnimationFrame(animate);
            renderer.render(scene, camera);
            controls.current.update(); // Update controls in each frame
        };

        animate();

        return () => {
            mountRef.current.removeChild(renderer.domElement);
            controls.current.dispose(); // Dispose controls when unmounting
        };
    }, [spacing, blockData, enableZoom, enableRotation]);

    const handleSpacingChange = (e) => {
        setSpacing(parseFloat(e.target.value));
        // Update camera position relative to scene center
        const newPosition = sceneCenter.current.clone().add(cameraOffset.current.multiplyScalar(spacing));
        controls.current.target.copy(sceneCenter.current);
        controls.current.object.position.copy(newPosition);
        controls.current.update();
    };

    const handleZoomChange = (e) => {
        setEnableZoom(e.target.checked);
    };

    const handleRotationChange = (e) => {
        setEnableRotation(e.target.checked);
    };

    return (
        <div>
            <div ref={mountRef} />
            <input
                type="range"
                min="1"
                max="5"
                value={spacing}
                onChange={handleSpacingChange}
                step="0.1"
            />
            <label>Spacing: {spacing}</label>
            <div>
                <input
                    type="checkbox"
                    checked={enableZoom}
                    onChange={handleZoomChange}
                />
                <label>Enable Zoom</label>
            </div>
            <div>
                <input
                    type="checkbox"
                    checked={enableRotation}
                    onChange={handleRotationChange}
                />
                <label>Enable Rotation</label>
            </div>
        </div>
    );
};

export default BlockVisualizer;
