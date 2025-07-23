import { useState, useEffect } from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Avatar, AvatarFallback } from "@/components/ui/avatar";
import { Input } from "@/components/ui/input";
import { 
  Table, 
  TableBody, 
  TableCell, 
  TableHead, 
  TableHeader, 
  TableRow 
} from "@/components/ui/table";
import { 
  Search, 
  Plus, 
  Edit, 
  Calendar, 
  Clock,
  Mail,
  Phone
} from "lucide-react";
import { supabase } from "@/integrations/supabase/client";
import { useToast } from "@/hooks/use-toast";

interface Staff {
  id: string;
  employee_id: string;
  position: string;
  department: string;
  hire_date: string;
  status: string;
  profiles: {
    first_name: string | null;
    last_name: string | null;
    phone: string | null;
  } | null;
}

interface StaffListProps {
  onEdit: (staff: Staff) => void;
  onSchedule: (staff: Staff) => void;
  onAdd: () => void;
  refreshTrigger?: number;
}

export const StaffList = ({ onEdit, onSchedule, onAdd, refreshTrigger }: StaffListProps) => {
  const [staff, setStaff] = useState<Staff[]>([]);
  const [filteredStaff, setFilteredStaff] = useState<Staff[]>([]);
  const [loading, setLoading] = useState(true);
  const [searchQuery, setSearchQuery] = useState("");
  const { toast } = useToast();

  const fetchStaff = async () => {
    try {
      const { data, error } = await supabase
        .from('staff')
        .select(`
          id,
          employee_id,
          position,
          department,
          hire_date,
          status,
          user_id,
          profiles(first_name, last_name, phone)
        `)
        .order('created_at', { ascending: false });

      if (error) throw error;
      setStaff((data as any) || []);
      setFilteredStaff((data as any) || []);
    } catch (error) {
      console.error('Error fetching staff:', error);
      toast({
        title: "Errore",
        description: "Impossibile caricare la lista del personale",
        variant: "destructive",
      });
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchStaff();
  }, [refreshTrigger]);

  useEffect(() => {
    const filtered = staff.filter(member => 
      member.profiles?.first_name?.toLowerCase().includes(searchQuery.toLowerCase()) ||
      member.profiles?.last_name?.toLowerCase().includes(searchQuery.toLowerCase()) ||
      member.employee_id.toLowerCase().includes(searchQuery.toLowerCase()) ||
      member.position.toLowerCase().includes(searchQuery.toLowerCase()) ||
      member.department.toLowerCase().includes(searchQuery.toLowerCase())
    );
    setFilteredStaff(filtered);
  }, [searchQuery, staff]);

  const getStatusBadge = (status: string) => {
    switch (status) {
      case 'active':
        return <Badge variant="default" className="bg-green-100 text-green-800">Attivo</Badge>;
      case 'inactive':
        return <Badge variant="secondary">Inattivo</Badge>;
      case 'terminated':
        return <Badge variant="destructive">Cessato</Badge>;
      default:
        return <Badge variant="outline">{status}</Badge>;
    }
  };

  const formatDate = (dateString: string) => {
    return new Date(dateString).toLocaleDateString('it-IT');
  };

  if (loading) {
    return (
      <Card>
        <CardContent className="p-6">
          <div className="text-center">Caricamento...</div>
        </CardContent>
      </Card>
    );
  }

  return (
    <Card>
      <CardHeader>
        <div className="flex items-center justify-between">
          <CardTitle className="flex items-center gap-2">
            <Clock className="h-5 w-5" />
            Lista Personale
          </CardTitle>
          <Button onClick={onAdd} className="flex items-center gap-2">
            <Plus className="h-4 w-4" />
            Aggiungi Membro
          </Button>
        </div>
        <div className="flex items-center gap-2 mt-4">
          <Search className="h-4 w-4 text-muted-foreground" />
          <Input
            placeholder="Cerca per nome, ID dipendente, posizione..."
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            className="max-w-sm"
          />
        </div>
      </CardHeader>
      <CardContent>
        {filteredStaff.length === 0 ? (
          <div className="text-center text-muted-foreground py-8">
            {searchQuery ? "Nessun risultato trovato" : "Nessun membro del personale trovato"}
          </div>
        ) : (
          <Table>
            <TableHeader>
              <TableRow>
                <TableHead>Dipendente</TableHead>
                <TableHead>ID</TableHead>
                <TableHead>Posizione</TableHead>
                <TableHead>Dipartimento</TableHead>
                <TableHead>Data Assunzione</TableHead>
                <TableHead>Stato</TableHead>
                <TableHead>Azioni</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {filteredStaff.map((member) => (
                <TableRow key={member.id}>
                  <TableCell>
                    <div className="flex items-center gap-3">
                      <Avatar>
                        <AvatarFallback>
                          {member.profiles?.first_name?.charAt(0) || ''}
                          {member.profiles?.last_name?.charAt(0) || ''}
                        </AvatarFallback>
                      </Avatar>
                      <div>
                        <div className="font-medium">
                          {member.profiles?.first_name} {member.profiles?.last_name}
                        </div>
                        {member.profiles?.phone && (
                          <div className="flex items-center gap-1 text-sm text-muted-foreground">
                            <Phone className="h-3 w-3" />
                            {member.profiles.phone}
                          </div>
                        )}
                      </div>
                    </div>
                  </TableCell>
                  <TableCell className="font-mono text-sm">
                    {member.employee_id}
                  </TableCell>
                  <TableCell>{member.position}</TableCell>
                  <TableCell>{member.department}</TableCell>
                  <TableCell>{formatDate(member.hire_date)}</TableCell>
                  <TableCell>{getStatusBadge(member.status)}</TableCell>
                  <TableCell>
                    <div className="flex items-center gap-2">
                      <Button
                        variant="outline"
                        size="sm"
                        onClick={() => onEdit(member)}
                      >
                        <Edit className="h-3 w-3" />
                      </Button>
                      <Button
                        variant="outline"
                        size="sm"
                        onClick={() => onSchedule(member)}
                      >
                        <Calendar className="h-3 w-3" />
                      </Button>
                    </div>
                  </TableCell>
                </TableRow>
              ))}
            </TableBody>
          </Table>
        )}
      </CardContent>
    </Card>
  );
};