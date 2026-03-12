"use client"

import { useEffect, useState, useCallback } from "react"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { api } from "@/lib/api"
import type { RefState } from "@/lib/types"
import { Plus, Edit2, Trash2, Loader2 } from "lucide-react"
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger } from "@/components/ui/dialog"
import { Textarea } from "@/components/ui/textarea"

export default function StatesPage() {
  const [states, setStates] = useState<RefState[]>([])
  const [isLoading, setIsLoading] = useState(true)
  const [isOpen, setIsOpen] = useState(false)
  const [editingId, setEditingId] = useState<string | null>(null)
  const [formData, setFormData] = useState({
    label: "",
    description: "",
    color: "#3B82F6",
  })

  const loadData = useCallback(async () => {
    setIsLoading(true)
    try {
      const data = await api.getRefStates()
      setStates(data)
    } catch (error) {
      console.error("Erreur chargement états:", error)
    } finally {
      setIsLoading(false)
    }
  }, [])

  useEffect(() => {
    loadData()
  }, [loadData])

  const handleOpenDialog = (state?: RefState) => {
    if (state) {
      setFormData({
        label: state.label,
        description: state.description || "",
        color: state.color || "#3B82F6",
      })
      setEditingId(state.id)
    } else {
      setFormData({ label: "", description: "", color: "#3B82F6" })
      setEditingId(null)
    }
    setIsOpen(true)
  }

  const handleSubmit = async () => {
    if (!formData.label) {
      alert("Le libellé est obligatoire")
      return
    }

    try {
      if (editingId) {
        await api.updateRefState(editingId, formData)
      } else {
        await api.createRefState(formData)
      }
      loadData()
      setIsOpen(false)
    } catch (error: any) {
      alert(error.message || "Erreur lors de l'enregistrement")
    }
  }

  const handleDelete = async (id: string) => {
    if (confirm("Êtes-vous sûr ?")) {
      try {
        await api.deleteRefState(id)
        loadData()
      } catch (error: any) {
        alert(error.message || "Erreur lors de la suppression")
      }
    }
  }

  return (
    <div className="space-y-6 p-6">
      <div className="flex justify-between items-center">
        <div>
          <h1 className="text-3xl font-bold">États de Traitement</h1>
          <p className="text-muted-foreground">Gérez les états personnalisés pour les courriers</p>
        </div>
        <Dialog open={isOpen} onOpenChange={setIsOpen}>
          <DialogTrigger asChild>
            <Button onClick={() => handleOpenDialog()} className="gap-2">
              <Plus className="w-4 h-4" />
              Nouvel État
            </Button>
          </DialogTrigger>
          <DialogContent>
            <DialogHeader>
              <DialogTitle>{editingId ? "Modifier" : "Créer"} un État</DialogTitle>
            </DialogHeader>
            <div className="space-y-4">
              <div>
                <label className="block text-sm font-medium mb-2">Libellé *</label>
                <Input 
                  value={formData.label} 
                  onChange={(e) => setFormData({ ...formData, label: e.target.value })} 
                  placeholder="Ex: En attente, Validé..."
                />
              </div>
              <div>
                <label className="block text-sm font-medium mb-2">Description</label>
                <Textarea
                  value={formData.description}
                  onChange={(e) => setFormData({ ...formData, description: e.target.value })}
                  placeholder="Usage de cet état"
                />
              </div>
              <div>
                <label className="block text-sm font-medium mb-2">Couleur de badge</label>
                <div className="flex gap-2">
                  <input
                    type="color"
                    value={formData.color}
                    onChange={(e) => setFormData({ ...formData, color: e.target.value })}
                    className="w-12 h-10 border rounded cursor-pointer"
                  />
                  <Input value={formData.color} onChange={(e) => setFormData({ ...formData, color: e.target.value })} />
                </div>
              </div>
              <Button onClick={handleSubmit} className="w-full">
                {editingId ? "Modifier" : "Créer"}
              </Button>
            </div>
          </DialogContent>
        </Dialog>
      </div>

      {isLoading ? (
        <div className="flex justify-center p-12">
          <Loader2 className="w-8 h-8 animate-spin text-primary" />
        </div>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
          {states.map((state) => (
            <Card key={state.id}>
              <CardHeader>
                <div className="flex items-center gap-3">
                  <div className="w-4 h-4 rounded-full" style={{ backgroundColor: state.color }} />
                  <CardTitle className="text-lg">{state.label}</CardTitle>
                </div>
              </CardHeader>
              <CardContent className="space-y-3">
                <p className="text-sm text-muted-foreground line-clamp-2">{state.description}</p>
                <div className="flex gap-2 justify-end">
                  <Button variant="outline" size="sm" onClick={() => handleOpenDialog(state)}>
                    <Edit2 className="w-4 h-4" />
                  </Button>
                  <Button variant="outline" size="sm" onClick={() => handleDelete(state.id)}>
                    <Trash2 className="w-4 h-4 text-destructive" />
                  </Button>
                </div>
              </CardContent>
            </Card>
          ))}
          {states.length === 0 && (
            <div className="col-span-full py-12 border-2 border-dashed rounded-lg text-center text-muted-foreground">
              Aucun état personnalisé défini.
            </div>
          )}
        </div>
      )}
    </div>
  )
}
