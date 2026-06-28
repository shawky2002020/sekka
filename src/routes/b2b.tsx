import { createFileRoute, Link } from "@tanstack/react-router";
import { useState } from "react";
import { Building2, Users, FileCheck, AlertTriangle, Plus, CheckCircle2, Circle, Clock } from "lucide-react";

export const Route = createFileRoute("/b2b")({
  head: () => ({
    meta: [
      { title: "سِكّة للشركات — إدارة المشاوير الحكومية للموظفين" },
    ],
  }),
  component: B2BDashboard,
});

function B2BDashboard() {
  const [employees, setEmployees] = useState([
    { id: 1, name: "أحمد مصطفى", role: "مهندس برمجيات", process: "كعب العمل", status: "pending", readiness: 40 },
    { id: 2, name: "سارة محمود", role: "محاسب", process: "تجديد بطاقة", status: "ready", readiness: 100 },
    { id: 3, name: "عمر خالد", role: "مدير مبيعات", process: "فيش وتشبيه", status: "in-progress", readiness: 80 },
  ]);

  const [newEmployeeName, setNewEmployeeName] = useState("");
  const [newEmployeeProcess, setNewEmployeeProcess] = useState("كعب العمل");

  const handleAddEmployee = (e: React.FormEvent) => {
    e.preventDefault();
    if (!newEmployeeName.trim()) return;
    
    setEmployees([
      ...employees,
      {
        id: Date.now(),
        name: newEmployeeName,
        role: "موظف جديد",
        process: newEmployeeProcess,
        status: "pending",
        readiness: 0,
      }
    ]);
    setNewEmployeeName("");
  };

  const getStatusBadge = (status: string) => {
    switch (status) {
      case "ready":
        return <span className="inline-flex items-center gap-1 bg-green-50 text-green-700 text-[10px] px-2 py-1 rounded-full font-bold"><CheckCircle2 className="h-3 w-3" /> جاهز للنزول</span>;
      case "in-progress":
        return <span className="inline-flex items-center gap-1 bg-blue-50 text-blue-700 text-[10px] px-2 py-1 rounded-full font-bold"><Clock className="h-3 w-3" /> جاري التجهيز</span>;
      default:
        return <span className="inline-flex items-center gap-1 bg-gray-100 text-gray-600 text-[10px] px-2 py-1 rounded-full font-bold"><Circle className="h-3 w-3" /> في الانتظار</span>;
    }
  };

  return (
    <div className="mx-auto max-w-6xl px-4 md:px-6 py-8">
      {/* Header */}
      <div className="mb-8 border-b pb-6 flex flex-col md:flex-row md:items-center justify-between gap-4">
        <div>
          <div className="inline-flex items-center gap-2 bg-primary/10 text-primary px-3 py-1 rounded-full text-xs font-bold mb-3">
            <Building2 className="h-4 w-4" /> سِكّة للشركات (HR Dashboard)
          </div>
          <h1 className="text-2xl md:text-3xl font-black text-foreground">إدارة أوراق الموظفين</h1>
          <p className="text-sm text-muted-foreground mt-2 max-w-xl">
            تابع جاهزية أوراق موظفينك قبل ما ينزلوا المصالح الحكومية. قلل أيام الإجازات الضايعة ووفر وقت الشركة.
          </p>
        </div>
        <Link to="/pricing" className="inline-flex items-center justify-center rounded-xl bg-foreground text-background px-5 py-2.5 text-sm font-semibold hover:opacity-90 transition shrink-0">
          ترقية الباقة
        </Link>
      </div>

      <div className="grid lg:grid-cols-[1fr_350px] gap-8">
        
        {/* Main Content: Tracking */}
        <div className="space-y-6">
          <div className="flex items-center justify-between">
            <h2 className="text-lg font-bold flex items-center gap-2"><Users className="h-5 w-5 text-primary" /> فريق العمل الحالي</h2>
          </div>

          <div className="bg-card border border-border rounded-2xl overflow-hidden shadow-sm">
            <div className="overflow-x-auto">
              <table className="w-full text-sm text-right">
                <thead className="bg-muted/50 text-muted-foreground text-xs uppercase">
                  <tr>
                    <th className="px-4 py-3 font-semibold">الموظف</th>
                    <th className="px-4 py-3 font-semibold">الإجراء المطلوب</th>
                    <th className="px-4 py-3 font-semibold">نسبة الجاهزية</th>
                    <th className="px-4 py-3 font-semibold">الحالة</th>
                    <th className="px-4 py-3 font-semibold text-center">إجراءات</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-border">
                  {employees.map((emp) => (
                    <tr key={emp.id} className="hover:bg-muted/20 transition">
                      <td className="px-4 py-4">
                        <div className="font-bold text-foreground">{emp.name}</div>
                        <div className="text-[10px] text-muted-foreground">{emp.role}</div>
                      </td>
                      <td className="px-4 py-4 font-medium">{emp.process}</td>
                      <td className="px-4 py-4">
                        <div className="flex items-center gap-2">
                          <div className="h-2 w-full max-w-[80px] bg-muted rounded-full overflow-hidden">
                            <div className="h-full bg-primary" style={{ width: `${emp.readiness}%` }} />
                          </div>
                          <span className="text-[10px] font-mono">{emp.readiness}%</span>
                        </div>
                      </td>
                      <td className="px-4 py-4">{getStatusBadge(emp.status)}</td>
                      <td className="px-4 py-4 text-center">
                        <Link to="/services" className="text-xs text-primary font-bold hover:underline">إرسال خطة</Link>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
            
            {/* Add Employee Form */}
            <div className="p-4 bg-muted/10 border-t border-border">
              <form onSubmit={handleAddEmployee} className="flex gap-3">
                <input 
                  value={newEmployeeName}
                  onChange={(e) => setNewEmployeeName(e.target.value)}
                  placeholder="اسم الموظف الجديد" 
                  className="flex-1 bg-background border border-border rounded-lg px-3 py-2 text-sm focus:outline-none focus:border-primary"
                />
                <select 
                  value={newEmployeeProcess}
                  onChange={(e) => setNewEmployeeProcess(e.target.value)}
                  className="bg-background border border-border rounded-lg px-3 py-2 text-sm focus:outline-none focus:border-primary"
                >
                  <option value="كعب العمل">كعب العمل</option>
                  <option value="فيش وتشبيه">فيش وتشبيه</option>
                  <option value="تجديد بطاقة">تجديد بطاقة</option>
                  <option value="شهادة ميلاد">شهادة ميلاد</option>
                </select>
                <button type="submit" className="bg-primary text-primary-foreground px-4 py-2 rounded-lg text-sm font-semibold hover:opacity-90 transition flex items-center gap-1">
                  <Plus className="h-4 w-4" /> إضافة
                </button>
              </form>
            </div>
          </div>
        </div>

        {/* Sidebar: Cost of Delay & Generator */}
        <div className="space-y-6">
          
          <div className="bg-red-50 border border-red-100 rounded-2xl p-5 relative overflow-hidden">
            <div className="absolute top-0 right-0 p-4 opacity-5 pointer-events-none">
              <AlertTriangle className="h-24 w-24 text-red-900" />
            </div>
            <h3 className="text-red-900 font-bold text-sm flex items-center gap-2 mb-2 relative z-10">
              <AlertTriangle className="h-4 w-4" /> تكلفة التأخير (Cost of Delay)
            </h3>
            <p className="text-red-800/80 text-xs leading-relaxed relative z-10">
              كل موظف بيروح يخلص ورق ويفشل، بيكلف الشركة <strong>يوم عمل كامل مدفوع الأجر</strong> كإجازة عارضة.
            </p>
            <div className="mt-4 bg-white/60 rounded-xl p-3 relative z-10 text-center border border-red-100">
              <span className="block text-[10px] text-red-700 font-bold mb-1">الخسارة التقديرية للشهر ده</span>
              <span className="text-2xl font-black text-red-900 font-latin">3,500 EGP</span>
            </div>
          </div>

          <div className="bg-card border border-border rounded-2xl p-5 shadow-sm">
            <h3 className="font-bold text-sm flex items-center gap-2 mb-4">
              <FileCheck className="h-4 w-4 text-primary" /> مولد خطة مخصصة للموظف
            </h3>
            <p className="text-xs text-muted-foreground mb-4">
              أنشئ خطة أوراق وإجراءات سريعة وابعتها للموظف على الواتساب عشان يروح وهو جاهز 100%.
            </p>
            <Link to="/services" className="w-full inline-flex items-center justify-center gap-2 bg-primary/10 text-primary hover:bg-primary hover:text-primary-foreground border border-primary/20 transition px-4 py-2.5 rounded-xl text-sm font-bold">
              توليد خطة جديدة
            </Link>
          </div>

        </div>
      </div>
    </div>
  );
}
