import React, { useEffect, useState } from "react";
import { AuthAPI } from "../lib/api";
import {
  UserIcon,
  BellIcon,
  ShieldCheckIcon,
  Cog6ToothIcon,
  KeyIcon,
  GlobeAltIcon,
  PaintBrushIcon,
  CircleStackIcon,
} from "@heroicons/react/24/outline";

const Settings = () => {
  const [activeTab, setActiveTab] = useState("profile");
  const [settings, setSettings] = useState([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");
  const [profile, setProfile] = useState({ firstName: "", lastName: "", email: "", phone: "", bio: "" });

  useEffect(() => {
    let mounted = true;
    setLoading(true);
    import("../lib/api").then(({ SettingsAPI }) => {
      SettingsAPI.list().then(({ settings }) => { if (mounted) setSettings(settings); }).catch((e)=> setError(e.message)).finally(()=> setLoading(false));
    });
    return () => { mounted = false; };
  }, []);

  useEffect(() => {
    let mounted = true;
    AuthAPI.me().then(({ user }) => {
      if (!mounted || !user) return;
      const [firstName = "", lastName = ""] = (user.name || "").split(" ");
      setProfile((p) => ({ ...p, firstName, lastName, email: user.email || "" }));
    }).catch(() => {});
    return () => { mounted = false; };
  }, []);

  const handleNavigation = (page) => {
    console.log(`Navigating to: ${page}`);
  };

  const settingsTabs = [
    { id: "profile", label: "Profile", icon: UserIcon },
    // { id: "notifications", label: "Notifications", icon: BellIcon },
    { id: "security", label: "Security", icon: ShieldCheckIcon },
    // { id: "preferences", label: "Preferences", icon: Cog6ToothIcon },
    // { id: "privacy", label: "Privacy", icon: KeyIcon },
    // { id: "appearance", label: "Appearance", icon: PaintBrushIcon },
    // { id: "integrations", label: "Integrations", icon: GlobeAltIcon },
    // { id: "data", label: "Data & Storage", icon: CircleStackIcon },
  ];

  const ProfileSettings = () => (
    <div className="space-y-6">
      <div className="bg-white rounded-2xl shadow-xl border border-gray-100/50 p-6">
        <h3 className="text-lg font-bold text-gray-900 mb-6">Personal Information</h3>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">First Name</label>
            <input
              type="text"
              value={profile.firstName}
              onChange={(e)=> setProfile({ ...profile, firstName: e.target.value })}
              className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
            />
          </div>
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">Last Name</label>
            <input
              type="text"
              value={profile.lastName}
              onChange={(e)=> setProfile({ ...profile, lastName: e.target.value })}
              className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
            />
          </div>
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">Email</label>
            <input
              type="email"
              value={profile.email}
              onChange={(e)=> setProfile({ ...profile, email: e.target.value })}
              className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
              readOnly
            />
          </div>
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">Phone</label>
            <input
              type="tel"
              value={profile.phone}
              onChange={(e)=> setProfile({ ...profile, phone: e.target.value })}
              className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
            />
          </div>
          <div className="md:col-span-2">
            <label className="block text-sm font-medium text-gray-700 mb-2">Bio</label>
            <textarea
              rows={3}
              value={profile.bio}
              onChange={(e)=> setProfile({ ...profile, bio: e.target.value })}
              className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus-border-transparent"
            />
          </div>
        </div>
        <div className="mt-6 flex justify-end">
          <button className="bg-blue-600 hover:bg-blue-700 text-white px-6 py-2 rounded-lg font-medium transition-colors">
            Save Changes
          </button>
        </div>
      </div>
    </div>
  );

  const NotificationSettings = () => (
    <div className="space-y-6">
      <div className="bg-white rounded-2xl shadow-xl border border-gray-100/50 p-6">
        <h3 className="text-lg font-bold text-gray-900 mb-6">Notification Preferences</h3>
        <div className="space-y-4">
          {[
            { label: "Email Notifications", description: "Receive notifications via email", enabled: true },
            { label: "Push Notifications", description: "Receive push notifications in browser", enabled: false },
            { label: "SMS Notifications", description: "Receive SMS for urgent updates", enabled: true },
            { label: "Low Stock Alerts", description: "Get notified when stock is low", enabled: true },
            { label: "Payment Reminders", description: "Reminders for pending payments", enabled: true },
            { label: "System Updates", description: "Notifications about system maintenance", enabled: false },
          ].map((item, index) => (
            <div key={index} className="flex items-center justify-between p-4 border border-gray-200 rounded-lg">
              <div>
                <h4 className="font-medium text-gray-900">{item.label}</h4>
                <p className="text-sm text-gray-500">{item.description}</p>
              </div>
              <button
                className={`relative inline-flex h-6 w-11 items-center rounded-full transition-colors ${
                  item.enabled ? 'bg-blue-600' : 'bg-gray-200'
                }`}
              >
                <span
                  className={`inline-block h-4 w-4 transform rounded-full bg-white transition-transform ${
                    item.enabled ? 'translate-x-6' : 'translate-x-1'
                  }`}
                />
              </button>
            </div>
          ))}
        </div>
      </div>
    </div>
  );

  const SecuritySettings = () => {
    const [oldPassword, setOldPassword] = useState("");
    const [newPassword, setNewPassword] = useState("");
    const [confirmPassword, setConfirmPassword] = useState("");
    const [msg, setMsg] = useState("");
    const [saving, setSaving] = useState(false);

    const onChangePassword = async () => {
      setMsg("");
      if (!oldPassword || !newPassword) { setMsg("Please fill all fields"); return; }
      if (newPassword !== confirmPassword) { setMsg("Passwords do not match"); return; }
      setSaving(true);
      try {
        await AuthAPI.changePassword(oldPassword, newPassword);
        setMsg("Password updated successfully");
        setOldPassword(""); setNewPassword(""); setConfirmPassword("");
      } catch (e) {
        setMsg(e.message);
      } finally {
        setSaving(false);
      }
    };

    return (
      <div className="space-y-6">
        <div className="bg-white rounded-2xl shadow-xl border border-gray-100/50 p-6">
          <h3 className="text-lg font-bold text-gray-900 mb-6">Password & Security</h3>
          <div className="space-y-6">
            {msg && <div className="text-sm {msg.includes('successfully') ? 'text-green-600' : 'text-red-600'}">{msg}</div>}
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">Current Password</label>
              <input type="password" value={oldPassword} onChange={(e)=>setOldPassword(e.target.value)} className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent" />
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">New Password</label>
              <input type="password" value={newPassword} onChange={(e)=>setNewPassword(e.target.value)} className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent" />
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">Confirm New Password</label>
              <input type="password" value={confirmPassword} onChange={(e)=>setConfirmPassword(e.target.value)} className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent" />
            </div>
            <button onClick={onChangePassword} disabled={saving} className="bg-blue-600 hover:bg-blue-700 disabled:opacity-60 text-white px-6 py-2 rounded-lg font-medium transition-colors">
              {saving ? 'Updating...' : 'Update Password'}
            </button>
          </div>
        </div>
      </div>
    );
  };

  const PreferencesSettings = () => (
    <div className="space-y-6">
      <div className="bg-white rounded-2xl shadow-xl border border-gray-100/50 p-6">
        <h3 className="text-lg font-bold text-gray-900 mb-6">General Preferences</h3>
        <div className="space-y-6">
          {loading && <div>Loading settings...</div>}
          {error && <div className="text-red-600 text-sm">{error}</div>}
          {!loading && settings.length > 0 && (
            <div className="border rounded-xl">
              <table className="w-full">
                <thead className="bg-gray-50">
                  <tr>
                    <th className="text-left p-2 border-b">Key</th>
                    <th className="text-left p-2 border-b">Value</th>
                  </tr>
                </thead>
                <tbody>
                  {settings.map((s) => (
                    <tr key={s._id} className="odd:bg-white even:bg-slate-50">
                      <td className="p-2 border-b">{s.key}</td>
                      <td className="p-2 border-b">{typeof s.value === 'object' ? JSON.stringify(s.value) : String(s.value)}</td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          )}
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">Language</label>
            <select className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent">
              <option value="en">English</option>
              <option value="es">Spanish</option>
              <option value="fr">French</option>
              <option value="de">German</option>
            </select>
          </div>
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">Timezone</label>
            <select className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent">
              <option value="UTC-8">Pacific Time (UTC-8)</option>
              <option value="UTC-5">Eastern Time (UTC-5)</option>
              <option value="UTC+0">UTC</option>
              <option value="UTC+5">Pakistan Time (UTC+5)</option>
            </select>
          </div>
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">Date Format</label>
            <select className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent">
              <option value="MM/DD/YYYY">MM/DD/YYYY</option>
              <option value="DD/MM/YYYY">DD/MM/YYYY</option>
              <option value="YYYY-MM-DD">YYYY-MM-DD</option>
            </select>
          </div>
          <button className="bg-blue-600 hover:bg-blue-700 text-white px-6 py-2 rounded-lg font-medium transition-colors">
            Save Preferences
          </button>
        </div>
      </div>
    </div>
  );

  const renderTabContent = () => {
    switch (activeTab) {
      case "profile": return <ProfileSettings />;
      case "notifications": return <NotificationSettings />;
      case "security": return <SecuritySettings />;
      case "preferences": return <PreferencesSettings />;
      default: return <ProfileSettings />;
    }
  };

  return (
    <div className="space-y-8">
          {/* Header */}
          <div className="mb-8">
            <div>
              <h1 className="text-3xl font-bold text-gray-900 mb-2">Settings</h1>
              <p className="text-gray-600">Manage your account settings and preferences</p>
            </div>
          </div>

          <div className="flex flex-col lg:flex-row gap-8">
            {/* Settings Navigation */}
            <div className="lg:w-64">
              <div className="bg-white rounded-2xl shadow-xl border border-gray-100/50 p-4">
                <nav className="space-y-2">
                  {settingsTabs.map((tab) => (
                    <button
                      key={tab.id}
                      onClick={() => setActiveTab(tab.id)}
                      className={`w-full flex items-center gap-3 px-4 py-3 rounded-lg text-left transition-all duration-200 ${
                        activeTab === tab.id
                          ? "bg-blue-100 text-blue-700 font-medium"
                          : "text-gray-600 hover:bg-gray-100"
                      }`}
                    >
                      <tab.icon className="w-5 h-5" />
                      <span>{tab.label}</span>
                    </button>
                  ))}
                </nav>
              </div>
            </div>

            {/* Settings Content */}
            <div className="flex-1">
              {renderTabContent()}
            </div>
          </div>
    </div>
  );
};

export default Settings;
