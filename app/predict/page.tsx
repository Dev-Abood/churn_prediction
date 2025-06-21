"use client";

import type React from "react";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { Alert, AlertDescription } from "@/components/ui/alert";
import { Badge } from "@/components/ui/badge";
import {
  BarChart3,
  TrendingUp,
  TrendingDown,
  Loader2,
  User,
} from "lucide-react";
import SidebarLayout from "@/components/sidebar-layout";
import { toast } from "sonner";

// define interface type for the customerData used in prediction
interface CustomerData {
  customerName: string;
  gender: string;
  seniorCitizen: string;
  partner: string;
  dependents: string;
  tenure: number;
  phoneService: string;
  multipleLines: string;
  internetService: string;
  onlineSecurity: string;
  onlineBackup: string;
  deviceProtection: string;
  techSupport: string;
  streamingTV: string;
  streamingMovies: string;
  contract: string;
  paperlessBilling: string;
  paymentMethod: string;
  monthlyCharges: number;
  totalCharges: number;
}

// interface for prediction result to be fetched
interface PredictionResult {
  prediction: "Churn" | "No Churn";
  confidence: number;
  factors: string[];
  sessionId: string;
}

export default function PredictPage(){
  const router = useRouter(); // for navigation to sessions
  // state for tracking all customer data being set during prediction session
  const [customerData, setCustomerData] = useState<CustomerData>({
    //* Assigning default values to act as placeholders for these parameters
    customerName: "",
    gender: "Male",
    seniorCitizen: "Yes",
    partner: "Yes",
    dependents: "Yes",
    tenure: 0,
    phoneService: "Yes",
    multipleLines: "Yes",
    internetService: "DSL",
    onlineSecurity: "Yes",
    onlineBackup: "Yes",
    deviceProtection: "Yes",
    techSupport: "Yes",
    streamingTV: "Yes",
    streamingMovies: "Yes",
    contract: "Month-to-month",
    paperlessBilling: "Yes",
    paymentMethod: "Electronic check",
    monthlyCharges: 0,
    totalCharges: 0,
  });
  // state for tracking loading
  const [isLoading, setIsLoading] = useState(false);
  // state to retreive the prediction results
  const [result, setResult] = useState<PredictionResult | null>(null);
  const [error, setError] = useState("");

  const handleInputChange = (
    field: keyof CustomerData,
    value: string | number
  ) => {
    // function to edit the state of customer data and manipulate the input
    setCustomerData((prev) => ({
      ...prev,
      [field]: value,
    }));
  };

  const handleSubmit = async (e: React.FormEvent) => {
    // handling submission of the form to send the data to the prediction model
    e.preventDefault();
    setIsLoading(true);
    setError("");
    setResult(null);

    //! API endpoint for sending the customer/session data being processed
    try{
      const response = await fetch("/api/predict", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        // json form to the flask app
        body: JSON.stringify(customerData),
      });

      if(!response.ok){
        // error checking and displaying response errors
        const errorData = await response.json();
        throw new Error(errorData.error || "Prediction failed");
      }

      const data = await response.json();
      setResult(data); // update the state to track the result of the response

      // Display toast message on success
      toast.success("Prediction Complete!", {
        description: `${customerData.customerName} is ${
          data.prediction === "Churn" ? "likely to churn" : "unlikely to churn"
        } with ${data.confidence}% confidence.`,
      });
    } catch(err){
      // in case of error, display the message and the error toast
      const errorMessage =
        err instanceof Error
          ? err.message
          : "Failed to get prediction. Please try again.";
      setError(errorMessage);
      toast.error("Prediction Failed", {
        description: errorMessage,
      });
    } finally{
      // when done, disable loading state
      setIsLoading(false);
    }
  };

  const resetForm = () => {
    //* reset form button to reset all the form filled data to the defaults
    setCustomerData({
      customerName: "",
      gender: "",
      seniorCitizen: "",
      partner: "",
      dependents: "",
      tenure: 0,
      phoneService: "",
      multipleLines: "",
      internetService: "",
      onlineSecurity: "",
      onlineBackup: "",
      deviceProtection: "",
      techSupport: "",
      streamingTV: "",
      streamingMovies: "",
      contract: "",
      paperlessBilling: "",
      paymentMethod: "",
      monthlyCharges: 0,
      totalCharges: 0,
    });
    // remove the request result as well
    setResult(null);
    setError("");
  };

  return(
    // TSX return code
    <SidebarLayout>
      <div className="p-8">
        <div className="mb-8">
          <h2 className="text-3xl font-bold text-gray-900 mb-2">
            New Churn Prediction
          </h2>
          <p className="text-gray-600">
            Enter customer details to predict churn probability using our
            XGBoost model
          </p>
        </div>

        <div className="grid lg:grid-cols-3 gap-8">
          {/* Form Section */}
          <div className="lg:col-span-2">
            <Card>
              <CardHeader>
                <CardTitle>Customer Information</CardTitle>
                <CardDescription>
                  Enter the customer details to predict churn probability
                </CardDescription>
              </CardHeader>
              <CardContent>
                {/* handle the submit of the form to send the request data */}
                <form onSubmit={handleSubmit} className="space-y-6">
                  {error && (
                    <Alert variant="destructive">
                      <AlertDescription>{error}</AlertDescription>
                    </Alert>
                  )}

                  {/* Customer Name */}
                  <div className="space-y-4">
                    <h3 className="text-lg font-semibold">
                      Customer Identification
                    </h3>
                    <div className="space-y-2">
                      <Label htmlFor="customerName">Customer Name</Label>
                      <div className="relative">
                        <User className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 h-4 w-4" />
                        <Input
                          id="customerName"
                          value={customerData.customerName}
                          onChange={(e) =>
                            handleInputChange("customerName", e.target.value)
                          }
                          placeholder="Enter customer name"
                          className="pl-10"
                          required
                        />
                      </div>
                    </div>
                  </div>

                  {/* Demographics */}
                  <div className="space-y-4">
                    <h3 className="text-lg font-semibold">Demographics</h3>
                    <div className="grid md:grid-cols-2 gap-4">
                      <div className="space-y-2">
                        <Label htmlFor="gender">Gender</Label>
                        <Select
                          value={customerData.gender}
                          onValueChange={(value) =>
                            handleInputChange("gender", value)
                          }
                          required
                        >
                          <SelectTrigger>
                            <SelectValue placeholder="Select gender" />
                          </SelectTrigger>
                          <SelectContent>
                            <SelectItem value="Male">Male</SelectItem>
                            <SelectItem value="Female">Female</SelectItem>
                          </SelectContent>
                        </Select>
                      </div>

                      <div className="space-y-2">
                        <Label htmlFor="seniorCitizen">Senior Citizen</Label>
                        <Select
                          value={customerData.seniorCitizen}
                          onValueChange={(value) =>
                            handleInputChange("seniorCitizen", value)
                          }
                          required
                        >
                          <SelectTrigger>
                            <SelectValue placeholder="Senior citizen?" />
                          </SelectTrigger>
                          <SelectContent>
                            <SelectItem value="Yes">Yes</SelectItem>
                            <SelectItem value="No">No</SelectItem>
                          </SelectContent>
                        </Select>
                      </div>

                      <div className="space-y-2">
                        <Label htmlFor="partner">Partner</Label>
                        <Select
                          value={customerData.partner}
                          onValueChange={(value) =>
                            handleInputChange("partner", value)
                          }
                          required
                        >
                          <SelectTrigger>
                            <SelectValue placeholder="Has partner?" />
                          </SelectTrigger>
                          <SelectContent>
                            <SelectItem value="Yes">Yes</SelectItem>
                            <SelectItem value="No">No</SelectItem>
                          </SelectContent>
                        </Select>
                      </div>

                      <div className="space-y-2">
                        <Label htmlFor="dependents">Dependents</Label>
                        <Select
                          value={customerData.dependents}
                          onValueChange={(value) =>
                            handleInputChange("dependents", value)
                          }
                          required
                        >
                          <SelectTrigger>
                            <SelectValue placeholder="Has dependents?" />
                          </SelectTrigger>
                          <SelectContent>
                            <SelectItem value="Yes">Yes</SelectItem>
                            <SelectItem value="No">No</SelectItem>
                          </SelectContent>
                        </Select>
                      </div>
                    </div>
                  </div>

                  {/* Account Information */}
                  <div className="space-y-4">
                    <h3 className="text-lg font-semibold">
                      Account Information
                    </h3>
                    <div className="grid md:grid-cols-2 gap-4">
                      <div className="space-y-2">
                        <Label htmlFor="tenure">Tenure (months)</Label>
                        <Input
                          id="tenure"
                          type="number"
                          min="0"
                          max="100"
                          onChange={(e) =>
                            handleInputChange(
                              "tenure",
                              Number.parseInt(e.target.value) || 0
                            )
                          }
                          required
                        />
                      </div>

                      <div className="space-y-2">
                        <Label htmlFor="contract">Contract</Label>
                        <Select
                          value={customerData.contract}
                          onValueChange={(value) =>
                            handleInputChange("contract", value)
                          }
                          required
                        >
                          <SelectTrigger>
                            <SelectValue placeholder="Select contract type" />
                          </SelectTrigger>
                          <SelectContent>
                            <SelectItem value="Month-to-month">
                              Month-to-month
                            </SelectItem>
                            <SelectItem value="One year">One year</SelectItem>
                            <SelectItem value="Two year">Two year</SelectItem>
                          </SelectContent>
                        </Select>
                      </div>

                      <div className="space-y-2">
                        <Label htmlFor="paperlessBilling">
                          Paperless Billing
                        </Label>
                        <Select
                          value={customerData.paperlessBilling}
                          onValueChange={(value) =>
                            handleInputChange("paperlessBilling", value)
                          }
                          required
                        >
                          <SelectTrigger>
                            <SelectValue placeholder="Paperless billing?" />
                          </SelectTrigger>
                          <SelectContent>
                            <SelectItem value="Yes">Yes</SelectItem>
                            <SelectItem value="No">No</SelectItem>
                          </SelectContent>
                        </Select>
                      </div>

                      <div className="space-y-2">
                        <Label htmlFor="paymentMethod">Payment Method</Label>
                        <Select
                          value={customerData.paymentMethod}
                          onValueChange={(value) =>
                            handleInputChange("paymentMethod", value)
                          }
                          required
                        >
                          <SelectTrigger>
                            <SelectValue placeholder="Select payment method" />
                          </SelectTrigger>
                          <SelectContent>
                            <SelectItem value="Electronic check">
                              Electronic check
                            </SelectItem>
                            <SelectItem value="Mailed check">
                              Mailed check
                            </SelectItem>
                            <SelectItem value="Bank transfer (automatic)">
                              Bank transfer (automatic)
                            </SelectItem>
                            <SelectItem value="Credit card (automatic)">
                              Credit card (automatic)
                            </SelectItem>
                          </SelectContent>
                        </Select>
                      </div>
                    </div>
                  </div>

                  {/* Services */}
                  <div className="space-y-4">
                    <h3 className="text-lg font-semibold">Services</h3>
                    <div className="grid md:grid-cols-2 gap-4">
                      <div className="space-y-2">
                        <Label htmlFor="phoneService">Phone Service</Label>
                        <Select
                          value={customerData.phoneService}
                          onValueChange={(value) =>
                            handleInputChange("phoneService", value)
                          }
                          required
                        >
                          <SelectTrigger>
                            <SelectValue placeholder="Has phone service?" />
                          </SelectTrigger>
                          <SelectContent>
                            <SelectItem value="Yes">Yes</SelectItem>
                            <SelectItem value="No">No</SelectItem>
                          </SelectContent>
                        </Select>
                      </div>

                      <div className="space-y-2">
                        <Label htmlFor="multipleLines">Multiple Lines</Label>
                        <Select
                          value={customerData.multipleLines}
                          onValueChange={(value) =>
                            handleInputChange("multipleLines", value)
                          }
                          required
                        >
                          <SelectTrigger>
                            <SelectValue placeholder="Multiple lines?" />
                          </SelectTrigger>
                          <SelectContent>
                            <SelectItem value="Yes">Yes</SelectItem>
                            <SelectItem value="No">No</SelectItem>
                            <SelectItem value="No phone service">
                              No phone service
                            </SelectItem>
                          </SelectContent>
                        </Select>
                      </div>

                      <div className="space-y-2">
                        <Label htmlFor="internetService">
                          Internet Service
                        </Label>
                        <Select
                          value={customerData.internetService}
                          onValueChange={(value) =>
                            handleInputChange("internetService", value)
                          }
                          required
                        >
                          <SelectTrigger>
                            <SelectValue placeholder="Internet service type" />
                          </SelectTrigger>
                          <SelectContent>
                            <SelectItem value="DSL">DSL</SelectItem>
                            <SelectItem value="Fiber optic">
                              Fiber optic
                            </SelectItem>
                            <SelectItem value="No">No</SelectItem>
                          </SelectContent>
                        </Select>
                      </div>

                      <div className="space-y-2">
                        <Label htmlFor="onlineSecurity">Online Security</Label>
                        <Select
                          value={customerData.onlineSecurity}
                          onValueChange={(value) =>
                            handleInputChange("onlineSecurity", value)
                          }
                          required
                        >
                          <SelectTrigger>
                            <SelectValue placeholder="Online security?" />
                          </SelectTrigger>
                          <SelectContent>
                            <SelectItem value="Yes">Yes</SelectItem>
                            <SelectItem value="No">No</SelectItem>
                            <SelectItem value="No internet service">
                              No internet service
                            </SelectItem>
                          </SelectContent>
                        </Select>
                      </div>

                      <div className="space-y-2">
                        <Label htmlFor="onlineBackup">Online Backup</Label>
                        <Select
                          value={customerData.onlineBackup}
                          onValueChange={(value) =>
                            handleInputChange("onlineBackup", value)
                          }
                          required
                        >
                          <SelectTrigger>
                            <SelectValue placeholder="Online backup?" />
                          </SelectTrigger>
                          <SelectContent>
                            <SelectItem value="Yes">Yes</SelectItem>
                            <SelectItem value="No">No</SelectItem>
                            <SelectItem value="No internet service">
                              No internet service
                            </SelectItem>
                          </SelectContent>
                        </Select>
                      </div>

                      <div className="space-y-2">
                        <Label htmlFor="deviceProtection">
                          Device Protection
                        </Label>
                        <Select
                          value={customerData.deviceProtection}
                          onValueChange={(value) =>
                            handleInputChange("deviceProtection", value)
                          }
                          required
                        >
                          <SelectTrigger>
                            <SelectValue placeholder="Device protection?" />
                          </SelectTrigger>
                          <SelectContent>
                            <SelectItem value="Yes">Yes</SelectItem>
                            <SelectItem value="No">No</SelectItem>
                            <SelectItem value="No internet service">
                              No internet service
                            </SelectItem>
                          </SelectContent>
                        </Select>
                      </div>

                      <div className="space-y-2">
                        <Label htmlFor="techSupport">Tech Support</Label>
                        <Select
                          value={customerData.techSupport}
                          onValueChange={(value) =>
                            handleInputChange("techSupport", value)
                          }
                          required
                        >
                          <SelectTrigger>
                            <SelectValue placeholder="Tech support?" />
                          </SelectTrigger>
                          <SelectContent>
                            <SelectItem value="Yes">Yes</SelectItem>
                            <SelectItem value="No">No</SelectItem>
                            <SelectItem value="No internet service">
                              No internet service
                            </SelectItem>
                          </SelectContent>
                        </Select>
                      </div>

                      <div className="space-y-2">
                        <Label htmlFor="streamingTV">Streaming TV</Label>
                        <Select
                          value={customerData.streamingTV}
                          onValueChange={(value) =>
                            handleInputChange("streamingTV", value)
                          }
                          required
                        >
                          <SelectTrigger>
                            <SelectValue placeholder="Streaming TV?" />
                          </SelectTrigger>
                          <SelectContent>
                            <SelectItem value="Yes">Yes</SelectItem>
                            <SelectItem value="No">No</SelectItem>
                            <SelectItem value="No internet service">
                              No internet service
                            </SelectItem>
                          </SelectContent>
                        </Select>
                      </div>

                      <div className="space-y-2">
                        <Label htmlFor="streamingMovies">
                          Streaming Movies
                        </Label>
                        <Select
                          value={customerData.streamingMovies}
                          onValueChange={(value) =>
                            handleInputChange("streamingMovies", value)
                          }
                          required
                        >
                          <SelectTrigger>
                            <SelectValue placeholder="Streaming movies?" />
                          </SelectTrigger>
                          <SelectContent>
                            <SelectItem value="Yes">Yes</SelectItem>
                            <SelectItem value="No">No</SelectItem>
                            <SelectItem value="No internet service">
                              No internet service
                            </SelectItem>
                          </SelectContent>
                        </Select>
                      </div>
                    </div>
                  </div>

                  {/* Billing */}
                  <div className="space-y-4">
                    <h3 className="text-lg font-semibold">
                      Billing Information
                    </h3>
                    <div className="grid md:grid-cols-2 gap-4">
                      <div className="space-y-2">
                        <Label htmlFor="monthlyCharges">
                          Monthly Charges ($)
                        </Label>
                        <Input
                          id="monthlyCharges"
                          type="number"
                          step="0.01"
                          min="0"
                          onChange={(e) =>
                            handleInputChange(
                              "monthlyCharges",
                              Number.parseFloat(e.target.value) || 0
                            )
                          }
                          required
                        />
                      </div>

                      <div className="space-y-2">
                        <Label htmlFor="totalCharges">Total Charges ($)</Label>
                        <Input
                          id="totalCharges"
                          type="number"
                          step="0.01"
                          min="0"
                          onChange={(e) =>
                            handleInputChange(
                              "totalCharges",
                              Number.parseFloat(e.target.value) || 0
                            )
                          }
                          required
                        />
                      </div>
                    </div>
                  </div>
                          {/* Track loading state */}
                  <div className="flex gap-4">
                    <Button
                      type="submit"
                      disabled={isLoading}
                      className="flex-1"
                    >
                      {isLoading ? (
                        <>
                          <Loader2 className="h-4 w-4 mr-2 animate-spin" />
                          Analyzing...
                        </>
                      ) : (
                        "Predict Churn"
                      )}
                    </Button>
                    {/* Reset form button */}
                    <Button type="button" variant="outline" onClick={resetForm}>
                      Reset Form
                    </Button>
                  </div>
                </form>
              </CardContent>
            </Card>
          </div>

          {/* Results Section */}
          <div className="lg:col-span-1">
            <Card className="sticky top-8">
              <CardHeader>
                <CardTitle>Prediction Results</CardTitle>
                <CardDescription>
                  XGBoost model prediction results
                </CardDescription>
              </CardHeader>
              <CardContent>
                {!result ? (
                  <div className="text-center py-8">
                    <BarChart3 className="h-12 w-12 text-gray-400 mx-auto mb-4" />
                    <p className="text-gray-500">
                      Fill out the form and click "Predict Churn" to see results
                    </p>
                  </div>
                ) : (
                  <div className="space-y-6">
                    {/* Customer Name */}
                    {customerData.customerName && (
                      <div className="text-center">
                        <h4 className="text-lg font-semibold text-gray-900">
                          {customerData.customerName}
                        </h4>
                        <p className="text-sm text-gray-500">
                          Customer Analysis
                        </p>
                      </div>
                    )}

                    {/* Prediction */}
                    <div className="text-center">
                      <div
                        className={`inline-flex items-center justify-center w-16 h-16 rounded-full mb-4 ${
                          result.prediction === "Churn"
                            ? "bg-red-100"
                            : "bg-green-100"
                        }`}
                      >
                        {result.prediction === "Churn" ? (
                          <TrendingDown className="h-8 w-8 text-red-600" />
                        ) : (
                          <TrendingUp className="h-8 w-8 text-green-600" />
                        )}
                      </div>
                      <h3 className="text-2xl font-bold mb-2">
                        {result.prediction}
                      </h3>
                      <Badge
                        variant={
                          result.prediction === "Churn"
                            ? "destructive"
                            : "default"
                        }
                        className="text-lg px-4 py-2"
                      >
                        {result.confidence}% Confidence
                      </Badge>
                    </div>

                    {/* Key Factors */}
                    <div>
                      <h4 className="font-semibold mb-3">Key Factors</h4>
                      <div className="space-y-2">
                        {result.factors.map((factor, index) => (
                          <div
                            key={index}
                            className="flex items-center space-x-2"
                          >
                            <div className="w-2 h-2 bg-blue-600 rounded-full"></div>
                            <span className="text-sm">{factor}</span>
                          </div>
                        ))}
                      </div>
                    </div>

                    {/* Recommendation */}
                    <div className="p-4 bg-blue-50 rounded-lg">
                      <h4 className="font-semibold mb-2">Recommendation</h4>
                      <p className="text-sm text-gray-700">
                        {result.prediction === "Churn"
                          ? "Consider implementing retention strategies such as personalized offers, improved customer service, or contract incentives."
                          : "Customer shows low churn risk. Focus on maintaining satisfaction and exploring upselling opportunities."}
                      </p>
                    </div>

                    {/* Button to navigate to sessions page */}
                    <Button
                      variant="outline"
                      className="w-full"
                      onClick={() => router.push("/sessions")}
                    >
                      View All Sessions
                    </Button>
                  </div>
                )}
              </CardContent>
            </Card>
          </div>
        </div>
      </div>
    </SidebarLayout>
  );
}
