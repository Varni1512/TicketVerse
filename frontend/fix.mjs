import fs from 'fs';

const filesToFix = [
  'src/components/layout/Footer.tsx',
  'src/components/layout/Navbar.tsx',
  'src/layouts/AppLayout.tsx',
  'src/main.tsx',
  'src/pages/BookingSuccess.tsx',
  'src/pages/EventDetails.tsx',
  'src/pages/Events.tsx',
  'src/pages/Home.tsx',
  'src/pages/MyBookings.tsx',
  'src/pages/SeatSelection.tsx',
  'src/routes/index.tsx',
  'src/services/bookingService.ts'
];

for (const file of filesToFix) {
  if (fs.existsSync(file)) {
    let content = fs.readFileSync(file, 'utf8');
    
    // Remove unused React imports
    content = content.replace(/import React(?:, \{[^}]+\})? from 'react';\n/g, (match) => {
      if (match.includes('{')) {
        return match.replace(/React, /, '');
      }
      return '';
    });

    // Specific fixes
    if (file === 'src/components/layout/Footer.tsx') {
      content = content.replace(/import \{ Ticket, Github, Twitter, Linkedin \} from 'lucide-react';/g, "import { Ticket } from 'lucide-react';");
      content = content.replace(/<Twitter className="h-5 w-5" \/>/g, 'Twitter');
      content = content.replace(/<Github className="h-5 w-5" \/>/g, 'Github');
      content = content.replace(/<Linkedin className="h-5 w-5" \/>/g, 'LinkedIn');
    }
    if (file === 'src/routes/index.tsx') {
      content = content.replace(/<AppLayout><NotFound \/><\/AppLayout>/g, "<NotFound />");
    }
    if (file === 'src/main.tsx') {
      content = '/// <reference types="vite/client" />\n' + content;
      content = content.replace(/import React from 'react';\n/, '');
    }
    if (file === 'src/pages/Home.tsx') {
      content = content.replace(/import \{ ArrowRight, Ticket \} from 'lucide-react';/g, "import { ArrowRight } from 'lucide-react';");
    }
    if (file === 'src/pages/MyBookings.tsx') {
      content = content.replace(/import \{ useAppStore \} from '..\/store\/useAppStore';\n/g, "");
    }
    if (file === 'src/services/bookingService.ts') {
      content = content.replace(/import \{ Booking, Seat \} from '..\/types';/g, "import { Booking } from '../types';");
    }
    
    fs.writeFileSync(file, content);
  }
}
