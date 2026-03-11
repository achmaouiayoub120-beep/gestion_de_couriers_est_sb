"use client"

import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"

export default function SettingsPage() {
  return (
    <div className="space-y-6 p-6">
      <div>
        <h1 className="text-3xl font-bold">Paramètres</h1>
        <p className="text-muted-foreground">Configurez les paramètres du système</p>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        <Card>
          <CardHeader>
            <CardTitle>Général</CardTitle>
          </CardHeader>
          <CardContent className="space-y-4">
            <div>
              <label className="block text-sm font-medium mb-2">Nom de l'Institution</label>
              <p className="text-sm">École Supérieure de Technologie Sidi Bennour</p>
            </div>
            <div>
              <label className="block text-sm font-medium mb-2">Version du Système</label>
              <p className="text-sm">1.0.0</p>
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardHeader>
            <CardTitle>Notifications</CardTitle>
          </CardHeader>
          <CardContent className="space-y-4">
            <div>
              <label className="block text-sm font-medium mb-2">Email pour les notifications</label>
              <p className="text-sm">admin@estsb.edu</p>
            </div>
            <Button variant="outline">Configurer les notifications</Button>
          </CardContent>
        </Card>
      </div>
    </div>
  )
}
