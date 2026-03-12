"use client"

import { useEffect, useState, useCallback } from "react"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { api } from "@/lib/api"
import type { User, Entity } from "@/lib/types"
import { Role } from "@/lib/types"
import { Plus, Edit2, Trash2, Loader2 } from "lucide-react"
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger } from "@/components/ui/dialog"
import { Input } from "@/components/ui/input"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"

export default function UsersPage() {
  const [users, setUsers] = useState<User[]>([])
  const [entities, setEntities] = useState<Entity[]>([])
  const [isLoading, setIsLoading] = useState(true)
  const [isOpen, setIsOpen] = useState(false)
  const [editingId, setEditingId] = useState<string | null>(null)
  const [formData, setFormData] = useState({
    name: "",
    email: "",
    role: Role.AGENT,
    password: "",
    entityId: "",
    isActive: true,
  })

  const loadData = useCallback(async () => {
    setIsLoading(true)
    try {
      const [usersRes, entitiesRes] = await Promise.all([
        api.getUsers(),
        api.getEntities(),
      ])
      setUsers(usersRes)
      setEntities(entitiesRes)
    } catch (error) {
      console.error("Erreur chargement utilisateurs:", error)
    } finally {
      setIsLoading(false)
    }
  }, [])

  useEffect(() => {
    loadData()
  }, [loadData])

  const handleOpenDialog = (user?: User) => {
    if (user) {
      setFormData({
        name: user.name,
        email: user.email,
        role: user.role,
        password: "", // Hide password
        entityId: user.entityId || "none",
        isActive: user.isActive,
      })
      setEditingId(user.id)
    } else {
      setFormData({
        name: "",
        email: "",
        role: Role.AGENT,
        password: "",
        entityId: "none",
        isActive: true,
      })
      setEditingId(null)
    }
    setIsOpen(true)
  }

  const handleSubmit = async () => {
    if (!formData.name || !formData.email) {
      alert("Nom et email sont obligatoires")
      return
    }

    try {
      const payload = {
        ...formData,
        entityId: formData.entityId === 'none' ? undefined : formData.entityId,
      }

      if (editingId) {
        // Remove password from update if empty
        if (!payload.password) delete (payload as any).password;
        await api.updateUser(editingId, payload)
      } else {
        if (!formData.password) {
          alert("Le mot de passe est obligatoire pour un nouvel utilisateur")
          return
        }
        await api.createUser(payload)
      }
      
      loadData()
      setIsOpen(false)
    } catch (error: any) {
      alert(error.message || "Erreur lors de l'enregistrement")
    }
  }

  const handleDelete = async (id: string) => {
    if (confirm("Êtes-vous sûr de vouloir supprimer cet utilisateur ?")) {
      try {
        await api.deleteUser(id)
        loadData()
      } catch (error: any) {
        alert(error.message || "Erreur lors de la suppression")
      }
    }
  }

  const getRoleLabel = (role: Role) => {
    const labels: Record<Role, string> = {
      [Role.SUPER_ADMIN]: "Super Admin",
      [Role.ADMIN]: "Admin",
      [Role.CHEF]: "Chef d'Entité",
      [Role.AGENT]: "Agent",
      [Role.AUDITOR]: "Auditeur",
    }
    return labels[role] || role
  }

  return (
    <div className="space-y-6 p-6">
      <div className="flex justify-between items-center">
        <div>
          <h1 className="text-3xl font-bold">Utilisateurs</h1>
          <p className="text-muted-foreground">Gérez les utilisateurs du système</p>
        </div>
        <Dialog open={isOpen} onOpenChange={setIsOpen}>
          <DialogTrigger asChild>
            <Button onClick={() => handleOpenDialog()} className="gap-2">
              <Plus className="w-4 h-4" />
              Nouvel Utilisateur
            </Button>
          </DialogTrigger>
          <DialogContent>
            <DialogHeader>
              <DialogTitle>{editingId ? "Modifier" : "Créer"} un Utilisateur</DialogTitle>
            </DialogHeader>
            <div className="space-y-4">
              <div>
                <label className="block text-sm font-medium mb-2">Nom *</label>
                <Input value={formData.name} onChange={(e) => setFormData({ ...formData, name: e.target.value })} />
              </div>
              <div>
                <label className="block text-sm font-medium mb-2">Email *</label>
                <Input
                  type="email"
                  value={formData.email}
                  onChange={(e) => setFormData({ ...formData, email: e.target.value })}
                />
              </div>
              <div>
                <label className="block text-sm font-medium mb-2">Rôle</label>
                <Select
                  value={formData.role}
                  onValueChange={(value) => setFormData({ ...formData, role: value as Role })}
                >
                  <SelectTrigger>
                    <SelectValue />
                  </SelectTrigger>
                  <SelectContent>
                    {Object.values(Role).map((role) => (
                      <SelectItem key={role} value={role}>
                        {getRoleLabel(role as Role)}
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              </div>
              <div>
                <label className="block text-sm font-medium mb-2">Entité</label>
                <Select
                  value={formData.entityId}
                  onValueChange={(value) => setFormData({ ...formData, entityId: value })}
                >
                  <SelectTrigger>
                    <SelectValue placeholder="Sélectionnez une entité" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="none">Aucune</SelectItem>
                    {entities.map((entity) => (
                      <SelectItem key={entity.id} value={entity.id}>
                        {entity.label}
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              </div>
              <div>
                <label className="block text-sm font-medium mb-2">
                  {editingId ? "Changer le mot de passe (optionnel)" : "Mot de passe *"}
                </label>
                <Input
                  type="password"
                  value={formData.password}
                  onChange={(e) => setFormData({ ...formData, password: e.target.value })}
                />
              </div>
              <Button onClick={handleSubmit} className="w-full">
                {editingId ? "Modifier" : "Créer"}
              </Button>
            </div>
          </DialogContent>
        </Dialog>
      </div>

      <Card>
        <CardHeader>
          <CardTitle>Liste des utilisateurs ({users.length})</CardTitle>
        </CardHeader>
        <CardContent>
          {isLoading ? (
            <div className="flex justify-center p-8">
              <Loader2 className="w-8 h-8 animate-spin text-primary" />
            </div>
          ) : (
            <div className="overflow-x-auto">
              <table className="w-full text-sm">
                <thead className="border-b">
                  <tr>
                    <th className="text-left py-3 px-4 font-semibold">Nom</th>
                    <th className="text-left py-3 px-4 font-semibold">Email</th>
                    <th className="text-left py-3 px-4 font-semibold">Rôle</th>
                    <th className="text-left py-3 px-4 font-semibold">Entité</th>
                    <th className="text-left py-3 px-4 font-semibold">Statut</th>
                    <th className="text-center py-3 px-4 font-semibold">Actions</th>
                  </tr>
                </thead>
                <tbody>
                  {users.map((user) => (
                    <tr key={user.id} className="border-b hover:bg-muted/50">
                      <td className="py-3 px-4">{user.name}</td>
                      <td className="py-3 px-4">{user.email}</td>
                      <td className="py-3 px-4">
                        <span className="px-3 py-1 bg-primary/10 text-primary rounded-full text-xs font-semibold">
                          {getRoleLabel(user.role)}
                        </span>
                      </td>
                      <td className="py-3 px-4">
                        {user.entityId ? entities.find((e) => e.id === user.entityId)?.label : "-"}
                      </td>
                      <td className="py-3 px-4">
                        <span
                          className={`px-3 py-1 rounded-full text-xs font-medium ${
                            user.isActive ? "bg-green-100 text-green-800" : "bg-gray-100 text-gray-800"
                          }`}
                        >
                          {user.isActive ? "Actif" : "Inactif"}
                        </span>
                      </td>
                      <td className="py-3 px-4">
                        <div className="flex justify-center gap-2">
                          <Button variant="ghost" size="sm" onClick={() => handleOpenDialog(user)}>
                            <Edit2 className="w-4 h-4" />
                          </Button>
                          <Button variant="ghost" size="sm" onClick={() => handleDelete(user.id)}>
                            <Trash2 className="w-4 h-4 text-destructive" />
                          </Button>
                        </div>
                      </td>
                    </tr>
                  ))}
                  {users.length === 0 && (
                    <tr>
                      <td colSpan={6} className="text-center py-8 text-muted-foreground">
                        Aucun utilisateur trouvé
                      </td>
                    </tr>
                  )}
                </tbody>
              </table>
            </div>
          )}
        </CardContent>
      </Card>
    </div>
  )
}
