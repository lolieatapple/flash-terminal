'use client';
// MatrixEffect.js
import React, { useEffect, useRef } from 'react';

const characters = '0123456789ABCDEFGHIJKLMNOPQRSTUVWXYZ';

const getRandomCharacter = () => characters.charAt(Math.floor(Math.random() * characters.length));
export const MatrixEffect = () => {
  const canvasRef = useRef(null);

  useEffect(() => {
    const canvas = canvasRef.current;
    const ctx = canvas.getContext('2d');

    canvas.width = window.innerWidth;
    canvas.height = window.innerHeight;

    const fontSize = 10;
    const columns = canvas.width / fontSize;

    const drops = [];

    // 用随机值初始化drops数组以使字符在屏幕上分布
    for (let i = 0; i < columns; i++) 
        drops[i] = Math.floor(Math.random() * canvas.height / fontSize);

    const draw = () => {
      ctx.fillStyle = 'rgba(0, 0, 0, 0.05)';
      ctx.fillRect(0, 0, canvas.width, canvas.height);

      ctx.fillStyle = '#00ff00';
      ctx.font = fontSize + 'px arial';

      for (let i = 0; i < drops.length; i++) {
        const text = getRandomCharacter();

        ctx.fillText(text, i * fontSize, drops[i] * fontSize);

        if (drops[i] * fontSize > canvas.height || Math.random() > 0.975) drops[i] = 0;

        drops[i]++;
      }
    };

    const interval = setInterval(draw, 33);

    return () => clearInterval(interval);
  }, []);

  return <canvas ref={canvasRef} className="absolute top-0 left-0 z-10" />;
};
