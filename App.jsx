import React, { useState, useEffect, useRef } from 'react';
  import * as THREE from 'three';
  import { Canvas, useFrame } from '@react-three/fiber';
  import { OrbitControls, Sphere, Line } from '@react-three/drei';
  import { Leva, useControls } from 'leva';
  import Plot from 'react-plotly.js';
  import './App.css'; // Asegúrate de tener un archivo CSS para estilos
  
  // Función para la proyección estereográfica
  function stereographicProjection(x, y) {
    const denom = 1 + x ** 2 + y ** 2;
    const Xs = (2 * x) / denom;
    const Ys = (2 * y) / denom;
    const Zs = (x ** 2 + y ** 2 - 1) / denom;
    return new THREE.Vector3(Xs, Ys, Zs);
  }
  
  function RiemannSphereScene({ complexPoint }) {
    const sphereRef = useRef();
    const projectionPointRef = useRef();
    const northPole = new THREE.Vector3(0, 0, 1);
  
    // Calcular el punto proyectado en la esfera
    const spherePoint = stereographicProjection(complexPoint.x, complexPoint.y);
  
    return (
      <>
        <ambientLight intensity={0.5} />
        <directionalLight position={[5, 5, 5]} intensity={1} />
        <OrbitControls />
        <Sphere ref={sphereRef} args={[1, 64, 64]}>
          <meshStandardMaterial color="lightblue" transparent opacity={0.4} />
        </Sphere>
        <Sphere ref={projectionPointRef} position={spherePoint} args={[0.05, 32, 32]} material={{ color: 'green' }} />
        <Line
          points={[northPole, spherePoint]}
          color="red"
          lineWidth={2}
        />
      </>
    );
  }
  
  function ComplexPlanePlot({ complexPoint, onPointChange }) {
    const handleClick = (event) => {
      if (event && event.points && event.points[0]) {
        const { x, y } = event.points[0];
        onPointChange({ x, y });
      }
    };
  
    return (
      <Plot
        data={[
          {
            x: [complexPoint.x],
            y: [complexPoint.y],
            type: 'scatter',
            mode: 'markers',
            marker: { color: 'red', size: 12 },
          },
        ]}
        layout={{
          title: 'Plano Complejo z = x + iy',
          xaxis: { range: [-3, 3], title: 'Re(z)' },
          yaxis: { range: [-3, 3], title: 'Im(z)' },
          width: 400,
          height: 400,
          plot_bgcolor: '#111',
          paper_bgcolor: '#111',
          font: { color: '#fff' },
          dragmode: 'pan',
        }}
        config={{ displayModeBar: false }}
        onClick={handleClick}
      />
    );
  }
  
  export default function App() {
    const [complexPoint, setComplexPoint] = useState({ x: 1, y: 0.5 });
  
    const handleComplexPointChange = (newPoint) => {
      setComplexPoint(newPoint);
    };
  
    const levaControls = useControls({
      'Re(z)': {
        value: complexPoint.x,
        min: -3,
        max: 3,
        step: 0.1,
        onChange: (value) => setComplexPoint((prev) => ({ ...prev, x: value })),
      },
      'Im(z)': {
        value: complexPoint.y,
        min: -3,
        max: 3,
        step: 0.1,
        onChange: (value) => setComplexPoint((prev) => ({ ...prev, y: value })),
      },
    });
  
    useEffect(() => {
      levaControls['Re(z)'] = complexPoint.x;
      levaControls['Im(z)'] = complexPoint.y;
    }, [complexPoint, levaControls]);
  
    return (
      <div className="app-container">
        <h1 className="title">Esfera de Riemann y Proyección Estereográfica</h1>
        <div className="main-layout">
          <div className="canvas-container">
            <Canvas camera={{ position: [0, 0, 3], fov: 50 }}>
              <RiemannSphereScene complexPoint={complexPoint} />
            </Canvas>
          </div>
          <div className="plot-container">
            <ComplexPlanePlot complexPoint={complexPoint} onPointChange={handleComplexPointChange} />
          </div>
        </div>
        <Leva collapsed={false} />
      </div>
    );
  }
