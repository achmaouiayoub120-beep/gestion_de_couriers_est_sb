"use client"

import { useEffect, useState, useCallback } from "react"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { api } from "@/lib/api"
import type { CourierType } from "@/lib/types"
import { Plus, Edit2, Trash2, Loader2 } from "lucide-react"
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger } from "@/components/ui/dialog"
import { Textarea } from "@/components/ui/textarea"

export default function TypesPage() {
  const [types, setTypes] = useState<CourierType[]>([])
  const [isLoading, setIsLoading] = useState(true)
  const [isOpen, setIsOpen] = useState(false)
  const [editingId, setEditingId] = useState<string | null>(null)
  const [formData, setFormData] = useState({
    label: "",
    description: "",
  })

  const loadData = useCallback(async () => {
    setIsLoading(true)
    try {
      const data = await api.getTypes()
      setTypes(data)
    } catch (error) {
      console.error("Erreur chargement types:", error)
    } finally {
      setIsLoading(false)
    }
  }, [])

  useEffect(() => {
    loadData()
  }, [loadData])

  const handleOpenDialog = (type?: CourierType) => {
    if (type) {
      setFormData({ label: type.label, description: type.description || "" })
      setEditingId(type.id)
    } else {
      setFormData({ label: "", description: "" })
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
        await api.updateType(editingId, formData)
      } else {
        await api.createType(formData)
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
        await api.deleteType(id)
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
          <h1 className="text-3xl font-bold">Types de Courrier</h1>
          <p className="text-muted-foreground">Gérez les types de courrier (Ex: Entrant, Sortant...)</p>
        </div>
        <Dialog open={isOpen} onOpenChange={setIsOpen}>
          <DialogTrigger asChild>
            <Button onClick={() => handleOpenDialog()} className="gap-2">
              <Plus className="w-4 h-4" />
              Nouveau Type
            </Button>
          </DialogTrigger>
          <DialogContent>
            <DialogHeader>
              <DialogTitle>{editingId ? "Modifier" : "Créer"} un Type</DialogTitle>
            </DialogHeader>
            <div className="space-y-4">
              <div>
                <label className="block text-sm font-medium mb-2">Libellé *</label>
                <Input 
                  value={formData.label} 
                  onChange={(e) => setFormData({ ...formData, label: e.target.value })} 
                  placeholder="Ex: Entrant, Sortant, Interne..."
                />
              </div>
              <div>
                <label className="block text-sm font-medium mb-2">Description</label>
                <Textarea
                  value={formData.description}
                  onChange={(e) => setFormData({ ...formData, description: e.target.value })}
                  placeholder="Description du type de courrier"
                />
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
          {types.map((type) => (
            <Card key={type.id}>
              <CardHeader>
                <CardTitle className="text-lg">{type.label}</CardTitle>
              </CardHeader>
              <CardContent className="space-y-3">
                <p className="text-sm text-muted-foreground line-clamp-2">{type.description}</p>
                <div className="flex gap-2 justify-end">
                  <Button variant="outline" size="sm" onClick={() => handleOpenDialog(type)}>
                    <Edit2 className="w-4 h-4" />
                  </Button>
                  <Button variant="outline" size="sm" onClick={() => handleDelete(type.id)}>
                    <Trash2 className="w-4 h-4 text-destructive" />
                  </Button>
                </div>
              </CardContent>
            </Card>
          ))}
          {types.length === 0 && (
            <div className="col-span-full py-12 border-2 border-dashed rounded-lg text-center text-muted-foreground">
              Aucun type de courrier défini.
            </div>
          )}
        </div>
      )}
    </div>
  )
}
