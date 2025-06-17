"use client"
import { useState, useEffect } from "react"
import {
  Avatar,
  AvatarFallback,
} from "@/app/_components/ui/avatar"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/app/_components/ui/card"
import { Input } from "@/app/_components/ui/input"
import { Label } from "@/app/_components/ui/label"
import { motion } from "framer-motion"
import { api } from "@/trpc/react"
import { useSession } from "next-auth/react"
import { Checkbox } from "@/app/_components/ui/checkbox"
import { format } from "date-fns"
import { ComponentLoading } from "@/app/_components/component-loading"


import { toast } from "sonner"
export function AnyProfileCard({ userId }: { userId: string }) {
  const { data: session } = useSession()
  const role = session?.user.role
  const perms = session?.user.permissions ?? []
  const has = (perm: string) => perms.includes(perm)


const { data: profileRaw, isLoading: profileLoading } = api.user.viewAnyProfile.useQuery({ userId })
  const [profile, setProfile] = useState<Profile>()
  const utils = api.useUtils();
 const [msgEmail, setMsgEmail] = useState(false);
  const [msgWhatsapp, setMsgWhatsapp] = useState(false);
  const [msgWeb, setMsgWeb] = useState(false);

  
  useEffect(() => {
    if (profileRaw) setProfile(profileRaw as Profile)
  }, [profileRaw])
  useEffect(() => {
    if (profile) {
      setMsgEmail(profile.msgEmail);
      setMsgWhatsapp(profile.msgWhatsapp);
      setMsgWeb(profile.msgWeb);
    }
  }, [profile]);

  const toggleNotification = api.user.updateNotification.useMutation({
  onSuccess: ({ user, field }) => {
    if (!field) {
      toast.success("Notification updated.");
    } else {
      const fieldKey = field as keyof Pick<typeof user, "msgEmail" | "msgWhatsapp" | "msgWeb">;
      const isOn = user[fieldKey];
      const formatted = field.replace("msg", "");

      toast.success(`${formatted} notifications turned ${isOn ? "ON" : "OFF"}.`);
    }
    utils.user.viewProfile.invalidate();
  },
  onError: (error) => {
    toast.error(error.message || "Failed to update notification.");
  },
});

const handleToggle = (
  key: "msgEmail" | "msgWhatsapp" | "msgWeb",
  currentValue: boolean,
  setFn: (val: boolean) => void
) => {
  if (!profile?.id) return;

  const newValue = !currentValue;
  setFn(newValue); // Optimistic update

  toggleNotification.mutate({
    userId: profile.id,
    [key]: newValue,
  });
};




  
  const containerVariants = {
    hidden: { opacity: 0, x: 20 },
    visible: {
      opacity: 1,
      x: 0,
      transition: {
        duration: 0.5,
        delayChildren: 0.1,
        staggerChildren: 0.1,
      },
    },
  }

  const itemVariants = {
    hidden: { opacity: 0, y: 10 },
    visible: {
      opacity: 1,
      y: 0,
      transition: {
        duration: 0.3,
      },
    },
  }

  
if(profileLoading) {
  return (  <ComponentLoading message="Loading data..." />

  )}
  if (!profile) return null

  return (
    <motion.div
      variants={containerVariants}
      initial="hidden"
      animate="visible"
      className="w-full h-auto max-w-sm rounded-lg shadow-xl border border-white/10 dark:border-white/10 bg-transparent bg-gradient-to-br from-gray-100 via-white to-gray-200 dark:from-gray-900 dark:via-gray-800 dark:to-gray-900"
    >
      <Card className="lg:pb-14 shadow-xl border border-white/10 dark:border-white/10 bg-transparent">
        <CardHeader className="flex flex-col items-center gap-3">
  <motion.div
    className="relative"
    whileHover={{ scale: 1.05 }}
    transition={{ duration: 0.2 }}
  >
    <Avatar className="h-24 w-24 ring-4 ring-teal-500/60 ring-offset-2">
      <AvatarFallback className="bg-gradient-to-r from-teal-500 to-purple-500 text-xl font-bold text-white">
        {profile.name?.charAt(0)}
      </AvatarFallback>
    </Avatar>
  </motion.div>

  <div className="text-center space-y-1">
    <CardTitle className="text-2xl font-semibold bg-gradient-to-r from-teal-600 to-purple-600 bg-clip-text text-transparent">
      {profile.name}
    </CardTitle>
    <CardDescription className="text-lg">{profile.email}</CardDescription>
    <p className="text-sm text-muted-foreground">{profile.phone}</p>
  </div>
</CardHeader>

<CardContent className="grid gap-6 px-8 pb-10 pt-4 text-base">
  {/* ROLE */}
  <motion.div variants={itemVariants}>
    <Label className="text-xl font-semibold">
      Role:&nbsp;
      {typeof profile.role === "string"
        ? profile.role
        : profile.role.name === "CUSTOMER"
        ? profile.role.name
        : `${profile.role.name} - ${profile.role.dept.name} - ${profile.role.dept.fullName}`}
    </Label>
  </motion.div>

 

  <hr className="mx-auto w-[80%] border-t border-gray-300 dark:border-gray-700" />

  {profile.type === "CUSTOMER" && profile.customer && (
  <>
    <motion.div variants={itemVariants} className="space-y-6">
      {[
        { title: "Company Billing Names", items: profile.customer.companyBilling },
        { title: "Brands", items: profile.customer.brands },
        { title: "Addresses", items: profile.customer.addresses },
      ].map(({ title, items }, idx, arr) => (
        <div key={title} className="space-y-2">
          <div>
            <Label className="text-xl font-semibold">{title}</Label>
            <ul className="list-disc list-inside text-base font-medium">
              {items.map((val, i) => (
                <li key={i}>{val}</li>
              ))}
            </ul>
          </div>

          {/* HR after each section except the last */}
          {idx < arr.length - 1 && (
            <hr className="mx-auto w-[80%] border-t border-gray-300 dark:border-gray-700" />
          )}
        </div>
      ))}
    <hr className="mt-4 mx-auto w-[80%] border-t border-gray-300 dark:border-gray-700" />

      {/* TOTAL ITEMS (No hr before or after) */}
      <div className="grid grid-cols-2 gap-4">
        <div>
          <Label className="text-md font-semibold">Total BOPP Items</Label>
          <p className="text-base font-medium">{profile.customer.totalItemsBOPP}</p>
        </div>
        <div>
          <Label className="text-md font-semibold">Total PET Items</Label>
          <p className="text-base font-medium">{profile.customer.totalItemsPET}</p>
        </div>
      </div>
    </motion.div>

    {/* Optional main section HR */}
    <hr className="mt-4 mx-auto w-[80%] border-t border-gray-300 dark:border-gray-700" />
  </>
)}


  {/* EMPLOYEE PERMISSIONS */}
  {profile.type === "EMPLOYEE" && (
    <>
      <motion.div variants={itemVariants} className="space-y-1">
        <Label className="text-xl font-semibold">Permissions</Label>
        <ul className="list-disc list-inside text-base font-medium">
          {session?.user.permissions?.length
            ? session.user.permissions.map((perm, idx) => <li key={idx}>{perm}</li>)
            : <li>No permissions</li>}
        </ul>
      </motion.div>

      <hr className="mx-auto w-[80%] border-t border-gray-300 dark:border-gray-700" />
    </>
  )}

  {/* NOTIFICATIONS */}
  <motion.div
    variants={itemVariants}
    className="space-y-4 rounded-md border border-gray-200 bg-gray-50 p-4 dark:border-gray-700 dark:bg-gray-800/40"
  >
    <Label className="text-lg font-semibold">Notifications</Label>

    <div className="flex items-center space-x-3">
      <Checkbox
        id="msgEmail"
        checked={msgEmail}
        onCheckedChange={() => handleToggle("msgEmail", msgEmail, setMsgEmail)}
      />
      <Label htmlFor="msgEmail" className="text-base">Email Notifications</Label>
    </div>

    <div className="flex items-center space-x-3">
      <Checkbox
        id="msgWhatsapp"
        checked={msgWhatsapp}
        onCheckedChange={() =>
          handleToggle("msgWhatsapp", msgWhatsapp, setMsgWhatsapp)
        }
      />
      <Label htmlFor="msgWhatsapp" className="text-base">WhatsApp Notifications</Label>
    </div>

    <div className="flex items-center space-x-3">
      <Checkbox
        id="msgWeb"
        checked={msgWeb}
        onCheckedChange={() => handleToggle("msgWeb", msgWeb, setMsgWeb)}
      />
      <Label htmlFor="msgWeb" className="text-base">In‑app (Web) Notifications</Label>
    </div>
  </motion.div>
   <hr className="mx-auto w-[80%] border-t border-gray-300 dark:border-gray-700" />

  {/* CREATED AT */}
  <motion.div variants={itemVariants}>
    <Label className="text-xl font-semibold">Account Created</Label>
    <p className="text-base font-medium text-muted-foreground">
      {format(new Date(profile.createdAt), "PPPppp")}
    </p>
  </motion.div>
</CardContent>


      </Card>
    </motion.div>
  )
}


// Profile type

type Profile = {
  id: string
  name: string
  email: string
  phone: string
  type: "CUSTOMER" | "EMPLOYEE"
  msgEmail: boolean
  msgWhatsapp: boolean
  msgWeb: boolean
  createdAt: string
  updatedAt: string
  role: "CUSTOMER" | {
    name: string
    dept: {
      name: string
      fullName: string
    }
  }
  customer?: {
    companyBilling: string[]
    brands: string[]
    addresses: string[]
    totalItemsBOPP: number
    totalItemsPET: number
  }
}
