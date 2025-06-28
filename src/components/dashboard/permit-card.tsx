import { Badge } from '@/components/ui/badge';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { cn } from '@/lib/utils';

type Risk = 'High' | 'Medium' | 'Low';
type Status = 'Approved' | 'Pending' | 'Rejected';

const riskColorMap: Record<Risk, string> = {
  High: 'bg-destructive/10 text-destructive border-destructive/20 hover:bg-destructive/20',
  Medium: 'bg-orange-400/10 text-orange-500 border-orange-400/20 hover:bg-orange-400/20',
  Low: 'bg-green-500/10 text-green-600 border-green-500/20 hover:bg-green-500/20',
};

const statusColorMap: Record<Status, string> = {
  Approved: 'bg-green-500/10 text-green-600 border-green-500/20 hover:bg-green-500/20',
  Pending: 'bg-orange-400/10 text-orange-500 border-orange-400/20 hover:bg-orange-400/20',
  Rejected: 'bg-destructive/10 text-destructive border-destructive/20 hover:bg-destructive/20',
};

const RiskBadge = ({ risk }: { risk: Risk }) => {
  return <Badge variant="outline" className={cn('capitalize font-semibold', riskColorMap[risk])}>{risk}</Badge>;
};

const StatusBadge = ({ status }: { status: Status }) => {
  return <Badge variant="outline" className={cn('capitalize font-semibold', statusColorMap[status])}>{status}</Badge>;
};

export const PermitCard = ({
  id,
  type,
  location,
  risk,
  status,
}: {
  id: string;
  type: string;
  location: string;
  risk: Risk;
  status: Status;
}) => {
  return (
    <Card className="hover:shadow-md transition-shadow duration-200">
      <CardContent className="p-4">
        <div className="flex justify-between items-start">
          <div>
            <h4 className="font-bold">{id} - {type}</h4>
            <p className="text-gray-500 text-sm">{location}</p>
          </div>
          <div className="flex items-center space-x-2">
            <RiskBadge risk={risk} />
            <StatusBadge status={status} />
          </div>
        </div>
        
        <div className="flex justify-between items-center mt-3">
          <span className="text-xs text-gray-400">Yesterday, 14:30</span>
          <Button variant="link" className="text-primary text-sm font-medium p-0 h-auto">
            View Details
          </Button>
        </div>
      </CardContent>
    </Card>
  );
};
