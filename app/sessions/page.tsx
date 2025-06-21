"use client";

import { useState, useEffect } from "react";
import { useUser } from "@clerk/nextjs";
import { Button } from "@/components/ui/button";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Input } from "@/components/ui/input";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import {
  BarChart3,
  Search,
  TrendingUp,
  TrendingDown,
  Calendar,
  Trash2,
  Loader2,
  Eye,
} from "lucide-react";
import SidebarLayout from "@/components/sidebar-layout";
import ConfirmationModal from "@/components/confirmation-modal";
import SessionDetailModal from "@/components/session-detail-modal";
import { toast } from "sonner";
import { useRouter } from "next/navigation";

// interface for the data for the according prediction session
interface PredictionSession{
  id: string;
  createdAt: string;
  // prediction type matching the schema enumeration type
  prediction: "CHURN" | "NO_CHURN";
  confidence: number;
  keyFactors: string[];
  modelVersion: string;
  customerData: {
    customerName: string;
    gender: string;
    tenure: number;
    contract: string;
    monthlyCharges: number;
    totalCharges: number;
    seniorCitizen: string;
    partner: string;
    dependents: string;
    phoneService: string;
    multipleLines: string;
    internetService: string;
    onlineSecurity: string;
    onlineBackup: string;
    deviceProtection: string;
    techSupport: string;
    streamingTV: string;
    streamingMovies: string;
    paperlessBilling: string;
    paymentMethod: string;
  };
}

// interafce for tracking the stats made and returned by the prediction
interface SessionStats{
  total: number;
  churn: number;
  noChurn: number;
  avgConfidence: number;
}

export default function SessionsPage(){
  const { user } = useUser(); // for getting clerk user authentication

  // state to load and display all the prediction sessions to the user
  const [sessions, setSessions] = useState<PredictionSession[]>([]);
  // state to display filtered session based on user inputted filters
  const [filteredSessions, setFilteredSessions] = useState<PredictionSession[]>(
    []
  );
  // state for searching by name
  const [searchTerm, setSearchTerm] = useState("");
  // state to track the filters, e.g., churn or no churn sessions only display
  const [filterType, setFilterType] = useState("all"); // set default to display all sessions
  // state to track sorting type
  const [sortBy, setSortBy] = useState("newest");
  // state to track loading status
  const [isLoading, setIsLoading] = useState(true);
  // state for session stats
  const [stats, setStats] = useState<SessionStats>({
    total: 0,
    churn: 0,
    noChurn: 0,
    avgConfidence: 0,
  });

  // these states is according to the components open and tracking their status
  const [deleteModalOpen, setDeleteModalOpen] = useState(false);
  const [clearAllModalOpen, setClearAllModalOpen] = useState(false);
  const [sessionToDelete, setSessionToDelete] = useState<string | null>(null);
  const [selectedSession, setSelectedSession] =
    useState<PredictionSession | null>(null);
  const [detailModalOpen, setDetailModalOpen] = useState(false);

  useEffect(() => { // with each change to the user's data, fetch the sessions accordingly
    if(user){
      fetchSessions();
    }
  }, [user]);

  useEffect(() => { // with every change to the filtering or sessions, do filtering actions
    filterAndSortSessions();
  }, [sessions, searchTerm, filterType, sortBy]);

  const fetchSessions = async () => {
    try{
      // set loading state while fetching
      setIsLoading(true);
      // fetch the response from the backend URL
      const response = await fetch("/api/sessions");

      if(!response.ok){
        // error check the fetching request
        throw new Error("Failed to fetch sessions");
      }

      const data = await response.json();
      // set the sessions state to the data retreived 
      setSessions(data.sessions || []);
      console.log(data);

      // Calculate statistics
      const total = data.sessions?.length || 0;
      const churn =
        data.sessions?.filter(
          (s: PredictionSession) => s.prediction === "CHURN"
        ).length || 0;
      const noChurn = total - churn;
      const avgConfidence =
        total > 0
          ? Math.round(
              data.sessions.reduce(
                (acc: number, s: PredictionSession) => acc + s.confidence,
                0
              ) / total
            )
          : 0;
      
      // set the stats state to the calculated statistics
      setStats({ total, churn, noChurn, avgConfidence });
    } catch (error){
      // error handling
      console.error("Error fetching sessions:", error);
      toast.error("Failed to load sessions");
    } finally{
      // remove loading state upon finishing
      setIsLoading(false);
    }
  };

  const filterAndSortSessions = () => {
    // Filter function

    let filtered = [...sessions];

    // Filter by prediction type
    if (filterType !== "all") {
      filtered = filtered.filter((session) =>
        filterType === "churn"
          ? session.prediction === "CHURN"
          : session.prediction === "NO_CHURN"
      );
    }

    // Filter by search term
    if (searchTerm){ 
      filtered = filtered.filter(
        (session) =>
          session.prediction.toLowerCase().includes(searchTerm.toLowerCase()) ||
          session.confidence.toString().includes(searchTerm) ||
          session.customerData?.contract
            ?.toLowerCase()
            .includes(searchTerm.toLowerCase()) ||
          session.customerData?.customerName
            ?.toLowerCase()
            .includes(searchTerm.toLowerCase())
      );
    }

    // Sort sessions
    filtered.sort((a, b) => {
      switch (sortBy) {
        case "newest":
          return (
            new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime()
          );
        case "oldest":
          return (
            new Date(a.createdAt).getTime() - new Date(b.createdAt).getTime()
          );
        case "confidence-high":
          return b.confidence - a.confidence;
        case "confidence-low":
          return a.confidence - b.confidence;
        default:
          return 0;
      }
    });

    // after filtering list is defined, update the useState
    setFilteredSessions(filtered);
  };

  const handleDeleteSession = (sessionId: string) => {
    setSessionToDelete(sessionId);
    setDeleteModalOpen(true);
  };

  const confirmDeleteSession = async () => {
    // if no session to be deleted tracked in the state, leave immediately
    if(!sessionToDelete) return; 

    
    try{ // API endpoint function to delete the session
      const response = await fetch(`/api/sessions/${sessionToDelete}`, {
        method: "DELETE",
      });

      if(!response.ok){
        // error handling the response
        throw new Error("Failed to delete session");
      }

      // Remove from local state
      setSessions(sessions.filter(
        (session) => session.id !== sessionToDelete
      ));

      // fetch the sessions again to update the deleted state on display
      fetchSessions()
      // display success toast message
      toast.success("Session deleted successfully");
    } catch(error){
      // error handling and toast display
      console.error("Error deleting session:", error);
      toast.error("Failed to delete session");
    } finally{
      setDeleteModalOpen(false);
      setSessionToDelete(null);
    }
  };

  const handleClearAllSessions = () => {
    setClearAllModalOpen(true);
  };

  const confirmClearAllSessions = async () => {
    // function to clear all sessions from the buttom
    try{
      // upon receiving delete request, the backend will process deleting all the sessions
      const response = await fetch("/api/sessions", {
        method: "DELETE",
      });

      if(!response.ok){
        // error checking
        throw new Error("Failed to clear sessions");
      }

      // set all sessions and stats to empty
      setSessions([]);
      setStats({ total: 0, churn: 0, noChurn: 0, avgConfidence: 0 });

      // display success toast message
      toast.success("All sessions cleared successfully");
    } catch(error){
      console.error("Error clearing sessions:", error);
      toast.error("Failed to clear sessions");
    } finally{
      setClearAllModalOpen(false);
    }
  };

  const handleViewSession = (session: PredictionSession) => {
    // to view individual session and open the detail modal
    setSelectedSession(session);
    setDetailModalOpen(true);
  };

  if(isLoading){
    // in case of loading state, display a loader component
    return(
      <SidebarLayout>
        <div className="p-8 flex items-center justify-center">
          <Loader2 className="h-8 w-8 animate-spin" />
        </div>
      </SidebarLayout>
    );
  }

  return(
    // TSX return error
    <SidebarLayout>
      <div className="p-8">
        <div className="mb-8">
          <h2 className="text-3xl font-bold text-gray-900 mb-2">
            Prediction Sessions
          </h2>
          <p className="text-gray-600">
            Review and manage your churn prediction history
          </p>
        </div>

        {/* Stats Cards */}
        <div className="grid md:grid-cols-4 gap-6 mb-8">
          <Card>
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium">
                Total Sessions
              </CardTitle>
              <BarChart3 className="h-4 w-4 text-muted-foreground" />
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold">{stats.total}</div>
            </CardContent>
          </Card>

          <Card>
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium">
                Churn Predictions
              </CardTitle>
              <TrendingDown className="h-4 w-4 text-red-500" />
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold text-red-600">
                {stats.churn}
              </div>
            </CardContent>
          </Card>

          <Card>
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium">No Churn</CardTitle>
              <TrendingUp className="h-4 w-4 text-green-500" />
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold text-green-600">
                {stats.noChurn}
              </div>
            </CardContent>
          </Card>

          <Card>
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium">
                Avg Confidence
              </CardTitle>
              <TrendingUp className="h-4 w-4 text-blue-500" />
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold text-blue-600">
                {stats.avgConfidence}%
              </div>
            </CardContent>
          </Card>
        </div>

        {/* Filters and Search */}
        <Card className="mb-6">
          <CardHeader>
            <CardTitle>Filter & Search</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="flex flex-col md:flex-row gap-4">
              <div className="flex-1">
                <div className="relative">
                  <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 h-4 w-4" />
                  <Input
                    placeholder="Search by customer name, prediction, or contract..."
                    value={searchTerm}
                    // set state for search term
                    onChange={(e) => setSearchTerm(e.target.value)}
                    className="pl-10"
                  />
                </div>
              </div>

              <Select value={filterType} onValueChange={setFilterType}>
                <SelectTrigger className="w-full md:w-48">
                  <SelectValue placeholder="Filter by type" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="all">All Predictions</SelectItem>
                  <SelectItem value="churn">Churn Only</SelectItem>
                  <SelectItem value="no-churn">No Churn Only</SelectItem>
                </SelectContent>
              </Select>

              <Select value={sortBy} onValueChange={setSortBy}>
                <SelectTrigger className="w-full md:w-48">
                  <SelectValue placeholder="Sort by" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="newest">Newest First</SelectItem>
                  <SelectItem value="oldest">Oldest First</SelectItem>
                  <SelectItem value="confidence-high">
                    High Confidence
                  </SelectItem>
                  <SelectItem value="confidence-low">Low Confidence</SelectItem>
                </SelectContent>
              </Select>

              {sessions.length > 0 && (
                <Button variant="outline" onClick={handleClearAllSessions}>
                  <Trash2 className="h-4 w-4 mr-2" />
                  Clear All
                </Button>
              )}
            </div>
          </CardContent>
        </Card>

        {/* Sessions List */}
        <Card>
          <CardHeader>
            <CardTitle>Session History</CardTitle>
            <CardDescription>
              Your complete prediction history ({filteredSessions.length} of{" "}
              {sessions.length} sessions)
            </CardDescription>
          </CardHeader>
          <CardContent>
            {filteredSessions.length === 0 ? (
              <div className="text-center py-12">
                <BarChart3 className="h-12 w-12 text-gray-400 mx-auto mb-4" />
                <p className="text-gray-500 mb-4">
                  {sessions.length === 0
                    ? "No prediction sessions yet"
                    : "No sessions match your filters"}
                </p>
              </div>
            ) : (
              <div className="space-y-4">
                {filteredSessions.map((session) => (
                  <div
                    key={session.id}
                    className="border rounded-lg p-6 hover:shadow-md transition-shadow"
                  >
                    <div className="flex items-start justify-between">
                      <div className="flex items-start space-x-4 flex-1">
                        <div
                          className={`p-3 rounded-full ${
                            session.prediction === "CHURN"
                              ? "bg-red-100"
                              : "bg-green-100"
                          }`}
                        >
                          {session.prediction === "CHURN" ? (
                            <TrendingDown className="h-6 w-6 text-red-600" />
                          ) : (
                            <TrendingUp className="h-6 w-6 text-green-600" />
                          )}
                        </div>

                        <div className="flex-1">
                          <div className="flex items-center space-x-3 mb-2">
                            <h3 className="text-lg font-semibold">
                              {session.customerData?.customerName ||
                                "Unknown Customer"}
                            </h3>
                            <Badge
                              variant={
                                session.prediction === "CHURN"
                                  ? "destructive"
                                  : "default"
                              }
                              className="text-sm"
                            >
                              {session.prediction === "CHURN"
                                ? "Churn"
                                : "No Churn"}{" "}
                              - {session.confidence}%
                            </Badge>
                          </div>

                          <div className="flex items-center space-x-4 text-sm text-gray-500 mb-3">
                            <div className="flex items-center space-x-1">
                              <Calendar className="h-4 w-4" />
                              <span>
                                {new Date(
                                  session.createdAt
                                ).toLocaleDateString()}
                              </span>
                            </div>
                            <span>
                              {new Date(session.createdAt).toLocaleTimeString()}
                            </span>
                          </div>

                          <div className="grid grid-cols-2 md:grid-cols-4 gap-4 text-sm mb-3">
                            <div>
                              <span className="font-medium">Gender:</span>{" "}
                              {session.customerData?.gender || "N/A"}
                            </div>
                            <div>
                              <span className="font-medium">Tenure:</span>{" "}
                              {session.customerData?.tenure || 0} months
                            </div>
                            <div>
                              <span className="font-medium">Contract:</span>{" "}
                              {session.customerData?.contract || "N/A"}
                            </div>
                            <div>
                              <span className="font-medium">Monthly:</span> $
                              {session.customerData?.monthlyCharges || 0}
                            </div>
                          </div>

                          {session.keyFactors &&
                            session.keyFactors.length > 0 && (
                              <div>
                                <span className="font-medium text-sm">
                                  Key Factors:
                                </span>
                                <div className="flex flex-wrap gap-1 mt-1">
                                  {session.keyFactors
                                    .slice(0, 3)
                                    .map((factor, index) => (
                                      <Badge
                                        key={index}
                                        variant="outline"
                                        className="text-xs"
                                      >
                                        {factor}
                                      </Badge>
                                    ))}
                                  {session.keyFactors.length > 3 && (
                                    <Badge
                                      variant="outline"
                                      className="text-xs"
                                    >
                                      +{session.keyFactors.length - 3} more
                                    </Badge>
                                  )}
                                </div>
                              </div>
                            )}
                        </div>
                      </div>

                      <div className="flex space-x-2">
                        <Button
                          variant="ghost"
                          size="sm"
                          onClick={() => handleViewSession(session)}
                          className="text-blue-600 hover:text-blue-800 hover:bg-blue-50"
                        >
                          <Eye className="h-4 w-4" />
                        </Button>
                        <Button
                          variant="ghost"
                          size="sm"
                          onClick={() => handleDeleteSession(session.id)}
                          className="text-red-600 hover:text-red-800 hover:bg-red-50"
                        >
                          <Trash2 className="h-4 w-4" />
                        </Button>
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            )}
          </CardContent>
        </Card>

        {/* Confirmation Modals */}
        <ConfirmationModal
          isOpen={deleteModalOpen}
          onClose={() => setDeleteModalOpen(false)}
          onConfirm={confirmDeleteSession}
          title="Delete Session"
          description="Are you sure you want to delete this prediction session? This action cannot be undone."
          confirmText="Delete"
          confirmVariant="destructive"
        />

        <ConfirmationModal
          isOpen={clearAllModalOpen}
          onClose={() => setClearAllModalOpen(false)}
          onConfirm={confirmClearAllSessions}
          title="Clear All Sessions"
          description="Are you sure you want to delete all prediction sessions? This action cannot be undone and will permanently remove all your prediction history."
          confirmText="Clear All"
          confirmVariant="destructive"
        />

        {/* Session Detail Modal */}
        {selectedSession && (
          <SessionDetailModal
            isOpen={detailModalOpen}
            onClose={() => setDetailModalOpen(false)}
            session={selectedSession}
          />
        )}
      </div>
    </SidebarLayout>
  );
}
