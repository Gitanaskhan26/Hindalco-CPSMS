import { Button } from '@/components/ui/button';
import { Plus, ScanLine, Map, ShieldCheck } from 'lucide-react';
import { StatsCard } from '@/components/dashboard/stats-card';
import { PermitCard } from '@/components/dashboard/permit-card';

export default function Home() {
  const stats = [
    { title: 'Active Permits', value: '24', change: '+12%' },
    { title: 'Pending Approval', value: '5', change: '-3%' },
    { title: 'High Risk Today', value: '3', change: '+1%' },
    { title: 'Compliance Rate', value: '92%', change: '+4%' },
  ];
  
  const recentPermits = [
    { id: 'P-1024', type: 'Hot Work', location: 'Rolling Mill A', risk: 'High', status: 'Approved' },
    { id: 'P-1025', type: 'Electrical', location: 'Substation 3', risk: 'Medium', status: 'Pending' },
    { id: 'P-1026', type: 'Height Work', location: 'Smelter Roof', risk: 'High', status: 'Rejected' },
    { id: 'P-1027', type: 'Confined Space', location: 'Tank 7', risk: 'Low', status: 'Approved' },
  ];

  return (
    <div className="container mx-auto px-4 py-6">
      <div className="flex justify-between items-center mb-6">
        <h1 className="text-2xl font-bold text-foreground">Dashboard</h1>
        <Button>
          <Plus className="mr-2" />
          New Permit
        </Button>
      </div>
      
      {/* Stats Cards */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4 mb-8">
        {stats.map((stat, index) => (
          <StatsCard 
            key={index}
            title={stat.title}
            value={stat.value}
            change={stat.change}
          />
        ))}
      </div>
      
      {/* Recent Permits */}
      <div className="bg-card rounded-xl shadow-sm p-4 md:p-6 mb-8 border">
        <h2 className="text-xl font-bold mb-4">Recent Permits</h2>
        <div className="space-y-4">
          {recentPermits.map((permit, index) => (
            <PermitCard 
              key={index}
              id={permit.id}
              type={permit.type}
              location={permit.location}
              risk={permit.risk as any}
              status={permit.status as any}
            />
          ))}
        </div>
      </div>
      
      {/* Quick Actions */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
        <Button 
          variant="outline" 
          className="h-24 text-base flex-col sm:flex-row"
        >
          <ScanLine className="mb-2 sm:mb-0 sm:mr-2" />
          Scan QR Code
        </Button>
        <Button 
          variant="outline" 
          className="h-24 text-base flex-col sm:flex-row"
        >
          <Map className="mb-2 sm:mb-0 sm:mr-2" />
          View Plant Map
        </Button>
        <Button 
          variant="outline" 
          className="h-24 text-base flex-col sm:flex-row"
        >
          <ShieldCheck className="mb-2 sm:mb-0 sm:mr-2" />
          Safety Checklist
        </Button>
      </div>
    </div>
  );
}
