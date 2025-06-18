"use client"

import { Dialog, DialogContent, DialogDescription, DialogHeader, DialogTitle } from "@/components/ui/dialog"
import { Badge } from "@/components/ui/badge"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Separator } from "@/components/ui/separator"
import { TrendingUp, TrendingDown, Calendar, Clock, User, CreditCard, Wifi, Phone } from "lucide-react"

interface PredictionSession {
  id: string
  createdAt: string
  prediction: "CHURN" | "NO_CHURN"
  confidence: number
  keyFactors: string[]
  modelVersion: string
  apiResponseTime?: number
  customerData: {
    customerName: string
    gender: string
    tenure: number
    contract: string
    monthlyCharges: number
    totalCharges: number
    seniorCitizen: string
    partner: string
    dependents: string
    phoneService: string
    multipleLines: string
    internetService: string
    onlineSecurity: string
    onlineBackup: string
    deviceProtection: string
    techSupport: string
    streamingTV: string
    streamingMovies: string
    paperlessBilling: string
    paymentMethod: string
  }
}

interface SessionDetailModalProps {
  isOpen: boolean
  onClose: () => void
  session: PredictionSession
}

export default function SessionDetailModal({ isOpen, onClose, session }: SessionDetailModalProps) {
  console.log(session)
  const formatDate = (dateString: string) => {
    const date = new Date(dateString)
    return {
      date: date.toLocaleDateString(),
      time: date.toLocaleTimeString(),
    }
  }

  const { date, time } = formatDate(session.createdAt)

  return (
    <Dialog open={isOpen} onOpenChange={onClose}>
      <DialogContent className="max-w-4xl max-h-[90vh] overflow-y-auto">
        <DialogHeader>
          <DialogTitle className="flex items-center space-x-3">
            <div className={`p-2 rounded-full ${session.prediction === "CHURN" ? "bg-red-100" : "bg-green-100"}`}>
              {session.prediction === "CHURN" ? (
                <TrendingDown className="h-5 w-5 text-red-600" />
              ) : (
                <TrendingUp className="h-5 w-5 text-green-600" />
              )}
            </div>
            <span>{session.customerData.customerName}</span>
            <Badge variant={session.prediction === "CHURN" ? "destructive" : "default"} className="ml-auto">
              {session.prediction === "CHURN" ? "Churn" : "No Churn"} - {session.confidence}%
            </Badge>
          </DialogTitle>
          <DialogDescription className="flex items-center space-x-4">
            <div className="flex items-center space-x-1">
              <Calendar className="h-4 w-4" />
              <span>{date}</span>
            </div>
            <div className="flex items-center space-x-1">
              <Clock className="h-4 w-4" />
              <span>{time}</span>
            </div>
            {session.apiResponseTime && (
              <span className="text-sm text-gray-500">Response: {session.apiResponseTime}ms</span>
            )}
          </DialogDescription>
        </DialogHeader>

        <div className="grid gap-6">
          {/* Prediction Results */}
          <Card>
            <CardHeader>
              <CardTitle className="text-lg">Prediction Results</CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="flex items-center justify-between">
                <span className="font-medium">Prediction:</span>
                <Badge variant={session.prediction === "CHURN" ? "destructive" : "default"}>
                  {session.prediction === "CHURN" ? "Likely to Churn" : "Unlikely to Churn"}
                </Badge>
              </div>
              <div className="flex items-center justify-between">
                <span className="font-medium">Confidence Score:</span>
                <span className="font-bold text-lg">{session.confidence}%</span>
              </div>
              <div className="flex items-center justify-between">
                <span className="font-medium">Model Version:</span>
                <span>{session.modelVersion}</span>
              </div>

              {session.keyFactors && session.keyFactors.length > 0 && (
                <div>
                  <span className="font-medium">Key Factors:</span>
                  <div className="flex flex-wrap gap-2 mt-2">
                    {session.keyFactors.map((factor, index) => (
                      <Badge key={index} variant="outline">
                        {factor}
                      </Badge>
                    ))}
                  </div>
                </div>
              )}
            </CardContent>
          </Card>

          {/* Customer Demographics */}
          <Card>
            <CardHeader>
              <CardTitle className="text-lg flex items-center space-x-2">
                <User className="h-5 w-5" />
                <span>Demographics</span>
              </CardTitle>
            </CardHeader>
            <CardContent>
              <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
                <div>
                  <span className="text-sm font-medium text-gray-500">Gender</span>
                  <p className="font-medium">{session.customerData.gender}</p>
                </div>
                <div>
                  <span className="text-sm font-medium text-gray-500">Senior Citizen</span>
                  <p className="font-medium">{session.customerData.seniorCitizen}</p>
                </div>
                <div>
                  <span className="text-sm font-medium text-gray-500">Partner</span>
                  <p className="font-medium">{session.customerData.partner}</p>
                </div>
                <div>
                  <span className="text-sm font-medium text-gray-500">Dependents</span>
                  <p className="font-medium">{session.customerData.dependents}</p>
                </div>
              </div>
            </CardContent>
          </Card>

          {/* Account Information */}
          <Card>
            <CardHeader>
              <CardTitle className="text-lg flex items-center space-x-2">
                <CreditCard className="h-5 w-5" />
                <span>Account Information</span>
              </CardTitle>
            </CardHeader>
            <CardContent>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <div className="space-y-4">
                  <div>
                    <span className="text-sm font-medium text-gray-500">Tenure</span>
                    <p className="font-medium">{session.customerData.tenure} months</p>
                  </div>
                  <div>
                    <span className="text-sm font-medium text-gray-500">Contract Type</span>
                    <p className="font-medium">{session.customerData.contract}</p>
                  </div>
                  <div>
                    <span className="text-sm font-medium text-gray-500">Paperless Billing</span>
                    <p className="font-medium">{session.customerData.paperlessBilling}</p>
                  </div>
                </div>
                <div className="space-y-4">
                  <div>
                    <span className="text-sm font-medium text-gray-500">Payment Method</span>
                    <p className="font-medium">{session.customerData.paymentMethod}</p>
                  </div>
                  <div>
                    <span className="text-sm font-medium text-gray-500">Monthly Charges</span>
                    <p className="font-medium">${session.customerData.monthlyCharges}</p>
                  </div>
                  <div>
                    <span className="text-sm font-medium text-gray-500">Total Charges</span>
                    <p className="font-medium">${session.customerData.totalCharges}</p>
                  </div>
                </div>
              </div>
            </CardContent>
          </Card>

          {/* Services */}
          <Card>
            <CardHeader>
              <CardTitle className="text-lg">Services & Features</CardTitle>
            </CardHeader>
            <CardContent className="space-y-6">
              {/* Phone Services */}
              <div>
                <div className="flex items-center space-x-2 mb-3">
                  <Phone className="h-4 w-4" />
                  <span className="font-medium">Phone Services</span>
                </div>
                <div className="grid grid-cols-2 gap-4 pl-6">
                  <div>
                    <span className="text-sm font-medium text-gray-500">Phone Service</span>
                    <p className="font-medium">{session.customerData.phoneService}</p>
                  </div>
                  <div>
                    <span className="text-sm font-medium text-gray-500">Multiple Lines</span>
                    <p className="font-medium">{session.customerData.multipleLines}</p>
                  </div>
                </div>
              </div>

              <Separator />

              {/* Internet Services */}
              <div>
                <div className="flex items-center space-x-2 mb-3">
                  <Wifi className="h-4 w-4" />
                  <span className="font-medium">Internet Services</span>
                </div>
                <div className="grid grid-cols-2 md:grid-cols-3 gap-4 pl-6">
                  <div>
                    <span className="text-sm font-medium text-gray-500">Internet Service</span>
                    <p className="font-medium">{session.customerData.internetService}</p>
                  </div>
                  <div>
                    <span className="text-sm font-medium text-gray-500">Online Security</span>
                    <p className="font-medium">{session.customerData.onlineSecurity}</p>
                  </div>
                  <div>
                    <span className="text-sm font-medium text-gray-500">Online Backup</span>
                    <p className="font-medium">{session.customerData.onlineBackup}</p>
                  </div>
                  <div>
                    <span className="text-sm font-medium text-gray-500">Device Protection</span>
                    <p className="font-medium">{session.customerData.deviceProtection}</p>
                  </div>
                  <div>
                    <span className="text-sm font-medium text-gray-500">Tech Support</span>
                    <p className="font-medium">{session.customerData.techSupport}</p>
                  </div>
                  <div>
                    <span className="text-sm font-medium text-gray-500">Streaming TV</span>
                    <p className="font-medium">{session.customerData.streamingTV}</p>
                  </div>
                  <div className="md:col-span-1">
                    <span className="text-sm font-medium text-gray-500">Streaming Movies</span>
                    <p className="font-medium">{session.customerData.streamingMovies}</p>
                  </div>
                </div>
              </div>
            </CardContent>
          </Card>
        </div>
      </DialogContent>
    </Dialog>
  )
}
