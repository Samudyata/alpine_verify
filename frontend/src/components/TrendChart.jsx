import { useEffect, useRef, useMemo, useState } from 'react';

// Synthetic fallback data per elevation band (used when real data not available)
function generateFallbackData(elevationBand) {
  const years = [];
  const values = [];
  const trendLine = [];

  const params = [
    { base: 85, decline: 1.1, noise: 8, seed1: 3.7, seed2: 2.3, changePoint: 2008 },
    { base: 145, decline: 0.6, noise: 6, seed1: 5.1, seed2: 1.7, changePoint: 2010 },
    { base: 200, decline: 0.35, noise: 5, seed1: 2.1, seed2: 4.3, changePoint: 2012 },
  ][elevationBand];

  for (let y = 2000; y <= 2024; y++) {
    years.push(y);
    const t = y - 2000;
    const noise = (Math.sin(y * params.seed1) + Math.cos(y * params.seed2) + Math.sin(t * 1.3 + elevationBand * 2.5)) * params.noise;
    const accel = (y > params.changePoint) ? (y - params.changePoint) * params.decline * 0.15 : 0;
    const trend = params.base - params.decline * t;
    values.push(Math.max(0, trend + noise - accel));
    trendLine.push(trend - (y > params.changePoint ? accel : 0));
  }

  return { years, values, trendLine, changePointYear: params.changePoint };
}

function lerp(a, b, t) {
  return a + (b - a) * t;
}

export default function TrendChart({ elevationBand, realData }) {
  const canvasRef = useRef(null);
  const animRef = useRef(null);
  const [hoveredYear, setHoveredYear] = useState(null);

  // Use real data if available, otherwise fallback
  const data = useMemo(() => {
    if (realData) {
      return {
        years: realData.years,
        values: realData.snow_days,
        trendLine: realData.trend_line,
        changePointYear: realData.change_point?.year || 2010,
      };
    }
    return generateFallbackData(elevationBand);
  }, [elevationBand, realData]);

  const slopePerDecade = useMemo(() => {
    if (realData?.mann_kendall?.slope) return realData.mann_kendall.slope.toFixed(1);
    const first5 = data.values.slice(0, 5).reduce((a, b) => a + b, 0) / 5;
    const last5 = data.values.slice(-5).reduce((a, b) => a + b, 0) / 5;
    return ((last5 - first5) / (data.years.length - 1) * 10).toFixed(1);
  }, [data, realData]);

  const dataSource = realData ? 'ERA5 Reanalysis (Open-Meteo)' : 'Synthetic demo data';

  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;
    const ctx = canvas.getContext('2d');

    const dpr = window.devicePixelRatio || 1;
    let width, height;
    const padding = { top: 50, right: 40, bottom: 70, left: 70 };

    function resize() {
      const rect = canvas.getBoundingClientRect();
      width = rect.width;
      height = rect.height;
      canvas.width = width * dpr;
      canvas.height = height * dpr;
      ctx.scale(dpr, dpr);
    }
    resize();

    const resizeObserver = new ResizeObserver(resize);
    resizeObserver.observe(canvas);

    function getDataPoints() {
      const minY = Math.min(...data.values, ...data.trendLine) - 5;
      const maxY = Math.max(...data.values, ...data.trendLine) + 5;
      const chartW = width - padding.left - padding.right;
      const chartH = height - padding.top - padding.bottom;

      return data.values.map((v, i) => ({
        x: padding.left + (i / (data.years.length - 1)) * chartW,
        y: padding.top + (1 - (v - minY) / (maxY - minY)) * chartH,
        value: v,
        year: data.years[i],
        trendY: padding.top + (1 - (data.trendLine[i] - minY) / (maxY - minY)) * chartH,
      }));
    }

    let particles = [];
    const PARTICLE_COUNT = 40;
    for (let i = 0; i < PARTICLE_COUNT; i++) {
      particles.push({
        progress: Math.random() * (data.values.length - 1),
        speed: 0.01 + Math.random() * 0.025,
        size: Math.random() * 3 + 1.5,
        opacity: Math.random() * 0.6 + 0.3,
        offsetY: (Math.random() - 0.5) * 12,
        trail: [],
        trailLength: Math.floor(Math.random() * 15) + 8,
      });
    }

    const bandColors = [
      { line: '#60A5FA', glow: '#3B82F6', particle: '#93C5FD' },
      { line: '#34D399', glow: '#10B981', particle: '#6EE7B7' },
      { line: '#A78BFA', glow: '#8B5CF6', particle: '#C4B5FD' },
    ];
    const colors = bandColors[elevationBand] || bandColors[0];

    function animate() {
      ctx.clearRect(0, 0, width, height);
      const points = getDataPoints();
      if (points.length === 0) return;

      const minY = Math.min(...data.values, ...data.trendLine) - 5;
      const maxY = Math.max(...data.values, ...data.trendLine) + 5;
      const chartW = width - padding.left - padding.right;
      const chartH = height - padding.top - padding.bottom;

      // Grid
      ctx.strokeStyle = 'rgba(30, 41, 59, 0.6)';
      ctx.lineWidth = 1;
      const yTicks = 6;
      for (let i = 0; i <= yTicks; i++) {
        const y = padding.top + (i / yTicks) * chartH;
        ctx.beginPath();
        ctx.moveTo(padding.left, y);
        ctx.lineTo(width - padding.right, y);
        ctx.stroke();
      }

      // Y-axis labels
      ctx.fillStyle = '#94A3B8';
      ctx.font = '12px Georgia, Times New Roman, serif';
      ctx.textAlign = 'right';
      for (let i = 0; i <= yTicks; i++) {
        const val = maxY - (i / yTicks) * (maxY - minY);
        const y = padding.top + (i / yTicks) * chartH;
        ctx.fillText(Math.round(val).toString(), padding.left - 10, y + 4);
      }

      // X-axis labels
      ctx.textAlign = 'center';
      for (let i = 0; i < data.years.length; i += 5) {
        const x = padding.left + (i / (data.years.length - 1)) * chartW;
        ctx.fillText(data.years[i].toString(), x, height - padding.bottom + 25);
      }
      ctx.fillText(data.years[data.years.length - 1].toString(), padding.left + chartW, height - padding.bottom + 25);

      // Axis titles
      ctx.font = '13px Georgia, Times New Roman, serif';
      ctx.textAlign = 'center';
      ctx.fillText('Year', width / 2, height - padding.bottom + 45);
      ctx.save();
      ctx.translate(18, height / 2);
      ctx.rotate(-Math.PI / 2);
      ctx.fillText('Snow Cover Duration (days)', 0, 0);
      ctx.restore();

      // Change point line
      const cpIdx = data.years.indexOf(data.changePointYear);
      if (cpIdx >= 0) {
        const cpX = padding.left + (cpIdx / (data.years.length - 1)) * chartW;
        ctx.setLineDash([4, 4]);
        ctx.strokeStyle = '#FBBF24';
        ctx.lineWidth = 2;
        ctx.beginPath();
        ctx.moveTo(cpX, padding.top);
        ctx.lineTo(cpX, padding.top + chartH);
        ctx.stroke();
        ctx.setLineDash([]);
        ctx.fillStyle = '#FBBF24';
        ctx.font = '11px Georgia, Times New Roman, serif';
        ctx.textAlign = 'center';
        ctx.fillText('Change Point', cpX, padding.top - 8);
      }

      // Trend line
      ctx.setLineDash([8, 6]);
      ctx.strokeStyle = '#F87171';
      ctx.lineWidth = 2;
      ctx.beginPath();
      points.forEach((p, i) => { if (i === 0) ctx.moveTo(p.x, p.trendY); else ctx.lineTo(p.x, p.trendY); });
      ctx.stroke();
      ctx.setLineDash([]);

      // Glow area
      const gradient = ctx.createLinearGradient(0, padding.top, 0, padding.top + chartH);
      gradient.addColorStop(0, `${colors.glow}20`);
      gradient.addColorStop(1, 'transparent');
      ctx.fillStyle = gradient;
      ctx.beginPath();
      ctx.moveTo(points[0].x, padding.top + chartH);
      points.forEach(p => ctx.lineTo(p.x, p.y));
      ctx.lineTo(points[points.length - 1].x, padding.top + chartH);
      ctx.closePath();
      ctx.fill();

      // Data line
      ctx.shadowColor = colors.glow;
      ctx.shadowBlur = 8;
      ctx.strokeStyle = colors.line;
      ctx.lineWidth = 2.5;
      ctx.beginPath();
      points.forEach((p, i) => { if (i === 0) ctx.moveTo(p.x, p.y); else ctx.lineTo(p.x, p.y); });
      ctx.stroke();
      ctx.shadowBlur = 0;

      // Data points
      points.forEach(p => {
        ctx.beginPath();
        ctx.arc(p.x, p.y, 4, 0, Math.PI * 2);
        ctx.fillStyle = colors.line;
        ctx.fill();
        ctx.strokeStyle = '#0F172A';
        ctx.lineWidth = 1.5;
        ctx.stroke();
      });

      // Particles
      particles.forEach(particle => {
        particle.progress += particle.speed;
        if (particle.progress >= points.length - 1) {
          particle.progress = 0;
          particle.offsetY = (Math.random() - 0.5) * 12;
          particle.trail = [];
        }
        const idx = Math.floor(particle.progress);
        const frac = particle.progress - idx;
        const nextIdx = Math.min(idx + 1, points.length - 1);
        const px = lerp(points[idx].x, points[nextIdx].x, frac);
        const py = lerp(points[idx].y, points[nextIdx].y, frac) + particle.offsetY;
        particle.trail.push({ x: px, y: py });
        if (particle.trail.length > particle.trailLength) particle.trail.shift();
        if (particle.trail.length > 1) {
          for (let t = 0; t < particle.trail.length - 1; t++) {
            const alpha = (t / particle.trail.length) * particle.opacity * 0.4;
            ctx.beginPath();
            ctx.arc(particle.trail[t].x, particle.trail[t].y, particle.size * 0.5, 0, Math.PI * 2);
            ctx.fillStyle = `rgba(147, 197, 253, ${alpha})`;
            ctx.fill();
          }
        }
        ctx.shadowColor = colors.particle;
        ctx.shadowBlur = 6;
        ctx.beginPath();
        ctx.arc(px, py, particle.size, 0, Math.PI * 2);
        ctx.fillStyle = `rgba(200, 220, 255, ${particle.opacity})`;
        ctx.fill();
        ctx.shadowBlur = 0;
      });

      // Slope annotation
      ctx.fillStyle = '#F87171';
      ctx.font = 'bold 13px Georgia, Times New Roman, serif';
      ctx.textAlign = 'left';
      const lastPt = points[points.length - 4];
      if (lastPt) {
        ctx.fillText(`${slopePerDecade} days/decade`, lastPt.x + 10, lastPt.trendY - 15);
        ctx.strokeStyle = '#F87171';
        ctx.lineWidth = 1.5;
        ctx.beginPath();
        ctx.moveTo(lastPt.x + 8, lastPt.trendY - 10);
        ctx.lineTo(lastPt.x, lastPt.trendY);
        ctx.stroke();
      }

      // Legend
      const legendY = height - padding.bottom + 55;
      ctx.font = '11px Georgia, Times New Roman, serif';
      ctx.textAlign = 'center';
      ctx.strokeStyle = colors.line;
      ctx.lineWidth = 2;
      ctx.beginPath();
      ctx.moveTo(width / 2 - 120, legendY);
      ctx.lineTo(width / 2 - 90, legendY);
      ctx.stroke();
      ctx.beginPath();
      ctx.arc(width / 2 - 105, legendY, 3, 0, Math.PI * 2);
      ctx.fillStyle = colors.line;
      ctx.fill();
      ctx.fillStyle = '#94A3B8';
      ctx.textAlign = 'left';
      ctx.fillText('Observed', width / 2 - 82, legendY + 4);
      ctx.setLineDash([6, 4]);
      ctx.strokeStyle = '#F87171';
      ctx.beginPath();
      ctx.moveTo(width / 2 + 30, legendY);
      ctx.lineTo(width / 2 + 60, legendY);
      ctx.stroke();
      ctx.setLineDash([]);
      ctx.fillText("Trend (Sen's slope)", width / 2 + 68, legendY + 4);

      // Data source label
      ctx.fillStyle = realData ? '#4ADE80' : '#FBBF24';
      ctx.font = '10px Georgia, serif';
      ctx.textAlign = 'right';
      ctx.fillText(dataSource, width - padding.right, padding.top - 8);

      // Hover tooltip
      if (hoveredYear !== null) {
        const hIdx = data.years.indexOf(hoveredYear);
        if (hIdx >= 0 && points[hIdx]) {
          const hp = points[hIdx];
          ctx.beginPath();
          ctx.arc(hp.x, hp.y, 7, 0, Math.PI * 2);
          ctx.strokeStyle = colors.line;
          ctx.lineWidth = 2;
          ctx.stroke();
          const tooltipW = 130;
          const tooltipH = 45;
          const tx = Math.min(hp.x + 12, width - padding.right - tooltipW);
          const ty = Math.max(hp.y - tooltipH - 5, padding.top);
          ctx.fillStyle = 'rgba(15, 23, 42, 0.9)';
          ctx.beginPath();
          ctx.roundRect(tx, ty, tooltipW, tooltipH, 8);
          ctx.fill();
          ctx.strokeStyle = 'rgba(96, 165, 250, 0.3)';
          ctx.lineWidth = 1;
          ctx.stroke();
          ctx.fillStyle = '#E2E8F0';
          ctx.font = 'bold 12px Georgia, serif';
          ctx.textAlign = 'left';
          ctx.fillText(`${hoveredYear}`, tx + 10, ty + 18);
          ctx.font = '11px Georgia, serif';
          ctx.fillStyle = '#94A3B8';
          ctx.fillText(`${Math.round(hp.value)} snow days`, tx + 10, ty + 35);
        }
      }

      animRef.current = requestAnimationFrame(animate);
    }

    animate();
    return () => { cancelAnimationFrame(animRef.current); resizeObserver.disconnect(); };
  }, [data, elevationBand, slopePerDecade, hoveredYear, realData, dataSource]);

  const handleMouseMove = (e) => {
    const canvas = canvasRef.current;
    if (!canvas) return;
    const rect = canvas.getBoundingClientRect();
    const x = e.clientX - rect.left;
    const pad = { left: 70, right: 40 };
    const chartW = rect.width - pad.left - pad.right;
    const relX = (x - pad.left) / chartW;
    const yearIdx = Math.round(relX * (data.years.length - 1));
    if (yearIdx >= 0 && yearIdx < data.years.length) setHoveredYear(data.years[yearIdx]);
    else setHoveredYear(null);
  };

  return (
    <canvas
      ref={canvasRef}
      className="w-full cursor-crosshair"
      style={{ height: '420px' }}
      onMouseMove={handleMouseMove}
      onMouseLeave={() => setHoveredYear(null)}
    />
  );
}
