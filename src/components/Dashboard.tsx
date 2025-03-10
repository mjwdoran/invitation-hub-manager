
import { useState } from "react";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { mockContacts, mockInvitations } from "@/lib/types";
import { PieChart, Pie, Cell, ResponsiveContainer, BarChart, Bar, XAxis, YAxis, Tooltip } from "recharts";
import { Calendar, Mail, MailOpen, Users } from "lucide-react";

export function Dashboard() {
  const [stats] = useState({
    activeContacts: mockContacts.filter(c => c.status === "active").length,
    totalContacts: mockContacts.length,
    activeInvitations: mockInvitations.filter(i => i.status !== "completed").length,
    totalInvitations: mockInvitations.length,
    
    // Calculate recipient statuses
    recipientStatus: [
      { name: "Pending", value: mockInvitations.flatMap(i => i.recipients).filter(r => r.status === "pending").length },
      { name: "Sent", value: mockInvitations.flatMap(i => i.recipients).filter(r => r.status === "sent").length },
      { name: "Delivered", value: mockInvitations.flatMap(i => i.recipients).filter(r => r.status === "delivered").length },
      { name: "Returned", value: mockInvitations.flatMap(i => i.recipients).filter(r => r.status === "returned").length }
    ],
    
    // Invitations by status
    invitationsByStatus: [
      { name: "Draft", value: mockInvitations.filter(i => i.status === "draft").length },
      { name: "Scheduled", value: mockInvitations.filter(i => i.status === "scheduled").length },
      { name: "Sent", value: mockInvitations.filter(i => i.status === "sent").length },
      { name: "Completed", value: mockInvitations.filter(i => i.status === "completed").length }
    ]
  });

  const COLORS = ['#0088FE', '#FFBB28', '#00C49F', '#FF8042'];

  return (
    <div className="animate-fade-in">
      <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-4 mb-8">
        <Card className="overflow-hidden transition-all hover:shadow-md">
          <CardHeader className="pb-2">
            <CardTitle className="text-sm font-medium text-muted-foreground">Active Contacts</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="flex items-center">
              <Users className="h-8 w-8 text-primary/80 mr-4" />
              <div>
                <div className="text-3xl font-bold">{stats.activeContacts}</div>
                <p className="text-xs text-muted-foreground">of {stats.totalContacts} total</p>
              </div>
            </div>
          </CardContent>
        </Card>

        <Card className="overflow-hidden transition-all hover:shadow-md">
          <CardHeader className="pb-2">
            <CardTitle className="text-sm font-medium text-muted-foreground">Active Campaigns</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="flex items-center">
              <Mail className="h-8 w-8 text-primary/80 mr-4" />
              <div>
                <div className="text-3xl font-bold">{stats.activeInvitations}</div>
                <p className="text-xs text-muted-foreground">of {stats.totalInvitations} total</p>
              </div>
            </div>
          </CardContent>
        </Card>

        <Card className="overflow-hidden transition-all hover:shadow-md">
          <CardHeader className="pb-2">
            <CardTitle className="text-sm font-medium text-muted-foreground">Pending Deliveries</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="flex items-center">
              <MailOpen className="h-8 w-8 text-primary/80 mr-4" />
              <div>
                <div className="text-3xl font-bold">
                  {stats.recipientStatus.find(s => s.name === "Pending")?.value || 0}
                </div>
                <p className="text-xs text-muted-foreground">invitations to send</p>
              </div>
            </div>
          </CardContent>
        </Card>

        <Card className="overflow-hidden transition-all hover:shadow-md">
          <CardHeader className="pb-2">
            <CardTitle className="text-sm font-medium text-muted-foreground">Next Event</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="flex items-center">
              <Calendar className="h-8 w-8 text-primary/80 mr-4" />
              <div>
                <div className="text-lg font-bold">Sep 30, 2023</div>
                <p className="text-xs text-muted-foreground">Product Launch</p>
              </div>
            </div>
          </CardContent>
        </Card>
      </div>

      <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-3">
        <Card className="col-span-1 lg:col-span-2 transition-all hover:shadow-md overflow-hidden">
          <CardHeader>
            <CardTitle>Invitation Status</CardTitle>
            <CardDescription>
              Overview of your mailing campaigns
            </CardDescription>
          </CardHeader>
          <CardContent>
            <div className="h-80 w-full">
              <ResponsiveContainer width="100%" height="100%">
                <BarChart
                  data={stats.invitationsByStatus}
                  margin={{ top: 20, right: 30, left: 20, bottom: 5 }}
                >
                  <XAxis dataKey="name" />
                  <YAxis />
                  <Tooltip 
                    contentStyle={{ 
                      backgroundColor: "var(--card)", 
                      border: "1px solid var(--border)",
                      borderRadius: "var(--radius)"
                    }} 
                  />
                  <Bar dataKey="value" fill="#0088FE" radius={[4, 4, 0, 0]} />
                </BarChart>
              </ResponsiveContainer>
            </div>
          </CardContent>
        </Card>

        <Card className="transition-all hover:shadow-md overflow-hidden">
          <CardHeader>
            <CardTitle>Delivery Status</CardTitle>
            <CardDescription>
              Status of your invitation deliveries
            </CardDescription>
          </CardHeader>
          <CardContent>
            <div className="h-80 w-full flex items-center justify-center">
              <ResponsiveContainer width="100%" height="100%">
                <PieChart>
                  <Pie
                    data={stats.recipientStatus}
                    cx="50%"
                    cy="50%"
                    innerRadius={60}
                    outerRadius={90}
                    paddingAngle={5}
                    dataKey="value"
                  >
                    {stats.recipientStatus.map((entry, index) => (
                      <Cell key={`cell-${index}`} fill={COLORS[index % COLORS.length]} />
                    ))}
                  </Pie>
                  <Tooltip 
                    contentStyle={{ 
                      backgroundColor: "var(--card)", 
                      border: "1px solid var(--border)",
                      borderRadius: "var(--radius)"
                    }} 
                  />
                </PieChart>
              </ResponsiveContainer>
            </div>
            <div className="grid grid-cols-2 gap-2 mt-2">
              {stats.recipientStatus.map((status, i) => (
                <div key={status.name} className="flex items-center">
                  <span className="w-3 h-3 rounded-full mr-2" style={{ backgroundColor: COLORS[i % COLORS.length] }}></span>
                  <span className="text-xs">{status.name}: {status.value}</span>
                </div>
              ))}
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  );
}
