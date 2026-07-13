import { useState, useEffect } from 'react';
import { Button } from '../ui/Button';

export type SeatType = 'AVAILABLE' | 'VIP' | 'UNAVAILABLE';

export interface SeatDefinition {
  rowNum: string;
  seatNumber: number;
  type: SeatType;
  price: number;
  status: string; // 'available', 'booked', etc.
}

interface SeatBuilderProps {
  onSave: (seats: SeatDefinition[]) => void;
  vipPrice: number;
  regularPrice: number;
  initialSeats?: SeatDefinition[];
}

export const SeatBuilder = ({ onSave, vipPrice, regularPrice, initialSeats }: SeatBuilderProps) => {
  const [rows, setRows] = useState(10);
  const [cols, setCols] = useState(15);
  
  // Store seat type configuration
  const [seatConfig, setSeatConfig] = useState<Record<string, SeatType>>({});
  
  // Paint tool selected
  const [selectedTool, setSelectedTool] = useState<SeatType>('AVAILABLE');
  const [isMouseDown, setIsMouseDown] = useState(false);

  useEffect(() => {
    if (initialSeats && initialSeats.length > 0) {
      const config: Record<string, SeatType> = {};
      let maxRow = 10;
      let maxCol = 15;
      
      initialSeats.forEach(seat => {
        let rowIndex = 0;
        for (let i = 0; i < seat.rowNum.length; i++) {
          rowIndex = rowIndex * 26 + (seat.rowNum.charCodeAt(i) - 64);
        }
        rowIndex -= 1;
        
        const colIndex = seat.seatNumber - 1;
        config[`${rowIndex}-${colIndex}`] = seat.type;
        
        if (rowIndex + 1 > maxRow) maxRow = rowIndex + 1;
        if (colIndex + 1 > maxCol) maxCol = colIndex + 1;
      });
      
      setSeatConfig(config);
      setRows(maxRow);
      setCols(maxCol);
    }
  }, [initialSeats]);

  const getRowLabel = (index: number) => {
    // A, B, C... Z, AA, AB etc.
    let label = '';
    let i = index;
    while (i >= 0) {
      label = String.fromCharCode(65 + (i % 26)) + label;
      i = Math.floor(i / 26) - 1;
    }
    return label;
  };

  const handleSeatInteract = (row: number, col: number) => {
    const key = `${row}-${col}`;
    setSeatConfig(prev => ({
      ...prev,
      [key]: selectedTool
    }));
  };

  const handleMouseEnter = (row: number, col: number) => {
    if (isMouseDown) {
      handleSeatInteract(row, col);
    }
  };

  const handleSave = () => {
    const seatsToSave: SeatDefinition[] = [];
    
    for (let r = 0; r < rows; r++) {
      const rowLabel = getRowLabel(r);
      for (let c = 0; c < cols; c++) {
        const key = `${r}-${c}`;
        const type = seatConfig[key] || 'AVAILABLE';
        
        if (type !== 'UNAVAILABLE') {
          seatsToSave.push({
            rowNum: rowLabel,
            seatNumber: c + 1,
            type: type,
            price: type === 'VIP' ? vipPrice : regularPrice,
            status: 'available'
          });
        }
      }
    }
    
    onSave(seatsToSave);
  };

  const getSeatColor = (type: SeatType) => {
    switch(type) {
      case 'AVAILABLE': return 'bg-slate-200 dark:bg-slate-700 hover:bg-slate-300 dark:hover:bg-slate-600';
      case 'VIP': return 'bg-yellow-400 dark:bg-yellow-500 hover:bg-yellow-500 dark:hover:bg-yellow-600';
      case 'UNAVAILABLE': return 'bg-slate-100 dark:bg-slate-900 border-dashed border-2 border-slate-300 dark:border-slate-700 opacity-30';
      default: return 'bg-slate-200';
    }
  };

  return (
    <div className="space-y-6">
      <div className="flex flex-wrap gap-6 items-end bg-slate-50 dark:bg-slate-800/50 p-4 rounded-xl border border-slate-200 dark:border-slate-800">
        <div>
          <label className="block text-xs font-medium text-slate-500 uppercase mb-1">Rows</label>
          <input 
            type="number" 
            min="1" max="50"
            value={rows} 
            onChange={(e) => setRows(Number(e.target.value))}
            className="w-20 h-10 px-3 rounded-lg border border-slate-300 dark:border-slate-700 bg-white dark:bg-slate-900"
          />
        </div>
        <div>
          <label className="block text-xs font-medium text-slate-500 uppercase mb-1">Columns</label>
          <input 
            type="number" 
            min="1" max="50"
            value={cols} 
            onChange={(e) => setCols(Number(e.target.value))}
            className="w-20 h-10 px-3 rounded-lg border border-slate-300 dark:border-slate-700 bg-white dark:bg-slate-900"
          />
        </div>

        <div className="h-10 w-px bg-slate-300 dark:bg-slate-700"></div>

        <div>
          <label className="block text-xs font-medium text-slate-500 uppercase mb-1">Paint Tool</label>
          <div className="flex gap-2 bg-white dark:bg-slate-900 p-1 rounded-lg border border-slate-200 dark:border-slate-700">
            <button
              onClick={() => setSelectedTool('AVAILABLE')}
              className={`px-3 py-1.5 rounded-md text-sm font-medium transition-colors ${selectedTool === 'AVAILABLE' ? 'bg-primary-100 text-primary-700 dark:bg-primary-900/30 dark:text-primary-400' : 'text-slate-600 dark:text-slate-400'}`}
            >
              Regular
            </button>
            <button
              onClick={() => setSelectedTool('VIP')}
              className={`px-3 py-1.5 rounded-md text-sm font-medium transition-colors ${selectedTool === 'VIP' ? 'bg-yellow-100 text-yellow-700 dark:bg-yellow-900/30 dark:text-yellow-500' : 'text-slate-600 dark:text-slate-400'}`}
            >
              VIP
            </button>
            <button
              onClick={() => setSelectedTool('UNAVAILABLE')}
              className={`px-3 py-1.5 rounded-md text-sm font-medium transition-colors ${selectedTool === 'UNAVAILABLE' ? 'bg-slate-200 text-slate-700 dark:bg-slate-800 dark:text-slate-300' : 'text-slate-600 dark:text-slate-400'}`}
            >
              Empty Space
            </button>
          </div>
        </div>
        
        <div className="ml-auto flex gap-3">
            <Button variant="outline" onClick={() => setSeatConfig({})}>Reset Grid</Button>
            <Button onClick={handleSave}>Save Seat Layout</Button>
        </div>
      </div>

      <div className="text-sm text-slate-500 text-center mb-2">
        Click and drag to paint seats. The stage is at the bottom.
      </div>

      {/* Grid container */}
      <div className="overflow-x-auto p-4 flex justify-center bg-white dark:bg-slate-950 border border-slate-200 dark:border-slate-800 rounded-xl">
        <div 
          className="inline-block cursor-crosshair select-none"
          onMouseDown={() => setIsMouseDown(true)}
          onMouseUp={() => setIsMouseDown(false)}
          onMouseLeave={() => setIsMouseDown(false)}
        >
          {Array.from({ length: rows }).map((_, r) => (
            <div key={r} className="flex gap-2 mb-2 items-center">
              <div className="w-8 text-right pr-2 text-xs font-medium text-slate-400">{getRowLabel(r)}</div>
              
              {Array.from({ length: cols }).map((_, c) => {
                const type = seatConfig[`${r}-${c}`] || 'AVAILABLE';
                return (
                  <div 
                    key={c}
                    onMouseDown={() => handleSeatInteract(r, c)}
                    onMouseEnter={() => handleMouseEnter(r, c)}
                    className={`w-8 h-8 rounded-md transition-colors ${getSeatColor(type)}`}
                    title={`Row ${getRowLabel(r)} - Seat ${c + 1} (${type})`}
                  />
                );
              })}
            </div>
          ))}
          
          {/* Stage representation */}
          <div className="mt-12 flex justify-center">
             <div className="w-2/3 h-12 bg-slate-100 dark:bg-slate-900 border-2 border-slate-300 dark:border-slate-700 rounded-t-3xl flex items-center justify-center text-slate-400 font-bold uppercase tracking-widest text-sm">
                Stage
             </div>
          </div>
        </div>
      </div>
    </div>
  );
};
