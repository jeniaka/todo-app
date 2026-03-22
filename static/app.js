'use strict';

// ─── State ────────────────────────────────────────────────────────────────────
const state = {
  todos: [],
  filter: 'all',
  lang: 'en',
  newPriority: 'low',
  activeDrawer: null,
  settings: null,
  chartView: false,
  activeChart: 'pie',
  linePeriod: '7',
  groupsView: false,
  activeGroup: null,
  groupFilter: 'all',
  groupSort: 'newest',
  notifications: [],
  unreadCount: 0,
};

// ─── Translations ─────────────────────────────────────────────────────────────
const LANGS = [
  { code: 'en', label: 'English',    dir: 'ltr' },
  { code: 'he', label: 'עברית',      dir: 'rtl' },
  { code: 'ar', label: 'العربية',    dir: 'rtl' },
  { code: 'es', label: 'Español',    dir: 'ltr' },
  { code: 'fr', label: 'Français',   dir: 'ltr' },
  { code: 'de', label: 'Deutsch',    dir: 'ltr' },
  { code: 'ru', label: 'Русский',    dir: 'ltr' },
  { code: 'pt', label: 'Português',  dir: 'ltr' },
  { code: 'zh', label: '中文',        dir: 'ltr' },
  { code: 'ja', label: '日本語',      dir: 'ltr' },
];

const TL = {
  en: {
    appTitle:'My Tasks',add:'Add',filterAll:'All',filterActive:'Active',filterDone:'Done',
    addTaskPlaceholder:'What needs to be done?',
    clearCompleted:'Clear completed',
    noTasks:'No tasks yet',noTasksSub:'Add something above to get started.',
    allDone:'All done!',allDoneSub:'Everything is checked off.',
    noneCompleted:'Nothing completed yet',noneCompletedSub:'Complete a task to see it here.',
    remaining:n=>`${n} task${n!==1?'s':''} remaining`,completed:n=>`${n} completed`,
    priority:'Priority',priorityNone:'None',priorityLow:'Low',priorityMedium:'Medium',priorityHigh:'High',
    description:'Notes',descriptionPlaceholder:'Add notes…',
    time:'Time',created:'Created',completedAt:'Completed',took:'Took',
    ago:'ago',justNow:'just now',
    subtasks:'Sub-tasks',addSubtask:'Add a sub-task…',
    deleteTask:'Delete task',save:'Save',close:'Close',
    notifyOnDone:'🔔 Notify when done',
    notifEmail:'Email Notifications',notifEmailDesc:'Receive email updates',
    notifEmailDailySummary:'Daily summary email',notifEmailTaskCompleted:'Task completed email',notifEmailWeeklyReport:'Weekly report email',
    durFmt:(m,h,d)=>d>0?`${d}d ${h%24}h`:h>0?`${h}h ${m%60}m`:`${m}m`,
    deleteConfirm:'Delete this task?',
    logout:'Sign out',languages:'Languages',notifications:'Notifications',
    loginTitle:'My Tasks',loginSubtitle:'Simple, beautiful task management.',
    continueWithGoogle:'Continue with Google',
    notifTaskReminders:'Task Reminders',notifTaskRemindersDesc:'Remind before tasks are due',
    notifDailyDigest:'Daily Digest',notifDailyDigestDesc:'Morning summary of today\'s tasks',
    notifTaskCompleted:'Task Completed',notifTaskCompletedDesc:'Show toast when completing a task',
    notifOverdueTasks:'Overdue Alerts',notifOverdueTasksDesc:'Alerts for overdue tasks',
    notifWeeklyReport:'Weekly Report',notifWeeklyReportDesc:'Weekly productivity summary',
    notifSound:'Notification Sound',notifSoundDesc:'Play sound for notifications',
    notifBadge:'Badge Count',notifBadgeDesc:'Show task count in browser tab title',
    doNotDisturb:'Do Not Disturb',doNotDisturbDesc:'Silence all notifications',
    taskDone:'Done',
    charts:'Analytics',totalTasks:'Total Tasks',completed:'Completed',
    pending:'Pending',avgTime:'Avg Time',chartPie:'Pie',chartDoughnut:'Doughnut',
    chartBar:'By Priority',chartHBar:'Horizontal',chartLine:'Trend',chartPolar:'Polar',
    last7:'Last 7 days',last30:'Last 30 days',backToTasks:'← Tasks',
    noData:'No data yet',
    groups:'Groups',myGroups:'My Groups',newGroup:'New Group',createGroup:'Create Group',
    groupName:'Group Name',groupDescription:'Description',groupColor:'Color',
    inviteMember:'Invite Member',inviteByEmail:'Invite by email',sendInvitation:'Send Invitation',
    copyInviteLink:'Copy Invite Link',linkCopied:'Link copied!',pendingInvite:'Pending',
    members:'Members',member:'Member',manager:'Manager',admin:'Admin',
    removeMember:'Remove Member',leaveGroup:'Leave Group',deleteGroup:'Delete Group',
    assignTo:'Assign to',assignedTo:'Assigned to',unassigned:'Unassigned',
    createdBy:'Created by',allTasks:'All Tasks',myTasksFilter:'My Tasks',filterUnassigned:'Unassigned',
    confirmLogout:'Are you sure you want to log out?',
    confirmDeleteTask:'Are you sure you want to delete this task?',
    confirmRemoveMember:'Remove {name} from this group?',
    confirmLeaveGroup:'Leave "{group}"?',
    confirmDeleteGroup:'Delete "{group}"? All tasks will be lost.',
    yes:'Yes',no:'No',cancel:'Cancel',
    noGroupsYet:'No groups yet — create one to collaborate with friends!',
    markAllRead:'Mark all as read',joinGroup:'Join Group',inviteAccepted:'You\'ve joined the group!',
    roleChanged:'Role updated',memberRemoved:'Member removed',taskAssigned:'Task assigned',
    noNotifications:'No notifications yet',
    notifTaskAssigned:'{name} assigned you "{task}" in {group}',
    notifTaskCompleted:'{name} completed "{task}" in {group}',
    notifGroupInvite:'{name} invited you to join "{group}"',
    notifMemberJoined:'{name} joined "{group}"',
  },
  he: {
    appTitle:'המשימות שלי',add:'הוסף',filterAll:'הכל',filterActive:'פעיל',filterDone:'הושלם',
    addTaskPlaceholder:'מה צריך לעשות?',
    clearCompleted:'נקה שהושלמו',
    noTasks:'אין משימות עדיין',noTasksSub:'הוסף משימה למעלה כדי להתחיל.',
    allDone:'הכל הושלם!',allDoneSub:'כל המשימות מסומנות.',
    noneCompleted:'עדיין לא הושלם כלום',noneCompletedSub:'השלם משימה כדי לראות אותה כאן.',
    remaining:n=>`נותרו ${n} משימות`,completed:n=>`${n} הושלמו`,
    priority:'עדיפות',priorityNone:'ללא',priorityLow:'נמוכה',priorityMedium:'בינונית',priorityHigh:'גבוהה',
    description:'הערות',descriptionPlaceholder:'הוסף הערות…',
    time:'זמן',created:'נוצר',completedAt:'הושלם',took:'לקח',
    ago:'לפני',justNow:'עכשיו',
    subtasks:'תתי-משימות',addSubtask:'הוסף תת-משימה…',
    deleteTask:'מחק משימה',save:'שמור',close:'סגור',
    notifyOnDone:'🔔 התראה בסיום',
    notifEmail:'התראות אימייל',notifEmailDesc:'קבל עדכונים במייל',
    notifEmailDailySummary:'סיכום יומי במייל',notifEmailTaskCompleted:'משימה הושלמה במייל',notifEmailWeeklyReport:'דוח שבועי במייל',
    durFmt:(m,h,d)=>d>0?`${d} ימים`:h>0?(m%60>0?`${h} שעות ו-${m%60} דקות`:`${h} שעות`):`${m} דקות`,
    deleteConfirm:'למחוק את המשימה?',
    logout:'התנתק',languages:'שפות',notifications:'התראות',
    loginTitle:'המשימות שלי',loginSubtitle:'ניהול משימות פשוט ויפה.',
    continueWithGoogle:'המשך עם גוגל',
    notifTaskReminders:'תזכורות משימות',notifTaskRemindersDesc:'תזכורת לפני תאריך יעד',
    notifDailyDigest:'סיכום יומי',notifDailyDigestDesc:'סיכום בוקר של משימות היום',
    notifTaskCompleted:'משימה הושלמה',notifTaskCompletedDesc:'הודעה בעת השלמת משימה',
    notifOverdueTasks:'התראות איחור',notifOverdueTasksDesc:'התראות על משימות שעבר זמנן',
    notifWeeklyReport:'דוח שבועי',notifWeeklyReportDesc:'סיכום פרודוקטיביות שבועי',
    notifSound:'צליל התראה',notifSoundDesc:'נגן צליל להתראות',
    notifBadge:'ספירת תגים',notifBadgeDesc:'הצג ספירת משימות בכותרת הדפדפן',
    doNotDisturb:'אל תפריע',doNotDisturbDesc:'השתק את כל ההתראות',
    taskDone:'הושלם',
    charts:'ניתוח',totalTasks:'סה״כ משימות',completed:'הושלמו',pending:'ממתינות',avgTime:'זמן ממוצע',chartPie:'עוגה',chartDoughnut:'דונאט',chartBar:'לפי עדיפות',chartHBar:'אופקי',chartLine:'מגמה',chartPolar:'פולרי',last7:'7 ימים אחרונים',last30:'30 ימים אחרונים',backToTasks:'← משימות',noData:'אין נתונים עדיין',
    groups:'קבוצות',myGroups:'הקבוצות שלי',newGroup:'קבוצה חדשה',createGroup:'צור קבוצה',
    groupName:'שם הקבוצה',groupDescription:'תיאור',groupColor:'צבע',
    inviteMember:'הזמן חבר',inviteByEmail:'הזמן באמצעות אימייל',sendInvitation:'שלח הזמנה',
    copyInviteLink:'העתק קישור הזמנה',linkCopied:'הקישור הועתק!',pendingInvite:'ממתין',
    members:'חברים',member:'חבר',manager:'מנהל',admin:'מנהל מערכת',
    removeMember:'הסר חבר',leaveGroup:'עזוב קבוצה',deleteGroup:'מחק קבוצה',
    assignTo:'הקצה ל',assignedTo:'מוקצה ל',unassigned:'לא מוקצה',
    createdBy:'נוצר על ידי',allTasks:'כל המשימות',myTasksFilter:'המשימות שלי',filterUnassigned:'לא מוקצה',
    confirmLogout:'האם אתה בטוח שברצונך להתנתק?',
    confirmDeleteTask:'האם אתה בטוח שברצונך למחוק משימה זו?',
    confirmRemoveMember:'להסיר את {name} מהקבוצה?',
    confirmLeaveGroup:'לעזוב את "{group}"?',
    confirmDeleteGroup:'למחוק את "{group}"? כל המשימות יאבדו.',
    yes:'כן',no:'לא',cancel:'ביטול',
    noGroupsYet:'אין קבוצות עדיין — צור אחת כדי לשתף פעולה עם חברים!',
    markAllRead:'סמן הכל כנקרא',joinGroup:'הצטרף לקבוצה',inviteAccepted:'הצטרפת לקבוצה!',
    roleChanged:'התפקיד עודכן',memberRemoved:'החבר הוסר',taskAssigned:'המשימה הוקצתה',
    noNotifications:'אין התראות עדיין',
    notifTaskAssigned:'{name} הקצה לך "{task}" ב{group}',
    notifTaskCompleted:'{name} השלים "{task}" ב{group}',
    notifGroupInvite:'{name} הזמין אותך להצטרף ל"{group}"',
    notifMemberJoined:'{name} הצטרף ל"{group}"',
  },
  ar: {
    appTitle:'مهامي',add:'إضافة',filterAll:'الكل',filterActive:'نشط',filterDone:'مكتمل',
    addTaskPlaceholder:'ما الذي يجب فعله؟',
    clearCompleted:'مسح المكتملة',
    noTasks:'لا توجد مهام بعد',noTasksSub:'أضف شيئًا أعلاه للبدء.',
    allDone:'تم الكل!',allDoneSub:'تم تحديد كل المهام.',
    noneCompleted:'لم يكتمل شيء بعد',noneCompletedSub:'أكمل مهمة لرؤيتها هنا.',
    remaining:n=>`${n} مهام متبقية`,completed:n=>`${n} مكتملة`,
    priority:'الأولوية',priorityNone:'لا شيء',priorityLow:'منخفض',priorityMedium:'متوسط',priorityHigh:'عالي',
    description:'ملاحظات',descriptionPlaceholder:'إضافة ملاحظات…',
    time:'الوقت',created:'تم الإنشاء',completedAt:'مكتمل',took:'استغرق',
    ago:'منذ',justNow:'الآن',
    subtasks:'المهام الفرعية',addSubtask:'إضافة مهمة فرعية…',
    deleteTask:'حذف المهمة',save:'حفظ',close:'إغلاق',
    notifyOnDone:'🔔 إشعار عند الإنجاز',
    notifEmail:'إشعارات البريد',notifEmailDesc:'تلقي تحديثات بالبريد الإلكتروني',
    notifEmailDailySummary:'ملخص يومي بالبريد',notifEmailTaskCompleted:'إتمام مهمة بالبريد',notifEmailWeeklyReport:'تقرير أسبوعي بالبريد',
    durFmt:(m,h,d)=>d>0?`${d} أيام`:h>0?`${h} ساعات ${m%60} دقيقة`:`${m} دقيقة`,
    deleteConfirm:'هل تريد حذف هذه المهمة؟',
    logout:'تسجيل الخروج',languages:'اللغات',notifications:'الإشعارات',
    loginTitle:'مهامي',loginSubtitle:'إدارة المهام البسيطة والجميلة.',
    continueWithGoogle:'المتابعة مع Google',
    notifTaskReminders:'تذكيرات المهام',notifTaskRemindersDesc:'تذكير قبل موعد المهام',
    notifDailyDigest:'الملخص اليومي',notifDailyDigestDesc:'ملخص صباحي لمهام اليوم',
    notifTaskCompleted:'اكتمال المهمة',notifTaskCompletedDesc:'إشعار عند إكمال مهمة',
    notifOverdueTasks:'تنبيهات التأخر',notifOverdueTasksDesc:'تنبيهات للمهام المتأخرة',
    notifWeeklyReport:'التقرير الأسبوعي',notifWeeklyReportDesc:'ملخص الإنتاجية الأسبوعي',
    notifSound:'صوت الإشعار',notifSoundDesc:'تشغيل صوت للإشعارات',
    notifBadge:'عدد الشارات',notifBadgeDesc:'إظهار عدد المهام في عنوان المتصفح',
    doNotDisturb:'عدم الإزعاج',doNotDisturbDesc:'كتم جميع الإشعارات',
    taskDone:'تم',
    charts:'تحليلات',totalTasks:'إجمالي المهام',completed:'مكتملة',pending:'معلقة',avgTime:'متوسط الوقت',chartPie:'دائري',chartDoughnut:'دونات',chartBar:'حسب الأولوية',chartHBar:'أفقي',chartLine:'الاتجاه',chartPolar:'قطبي',last7:'آخر 7 أيام',last30:'آخر 30 يومًا',backToTasks:'← المهام',noData:'لا توجد بيانات بعد',
    groups:'المجموعات',myGroups:'مجموعاتي',newGroup:'مجموعة جديدة',createGroup:'إنشاء مجموعة',
    groupName:'اسم المجموعة',groupDescription:'الوصف',groupColor:'اللون',
    inviteMember:'دعوة عضو',inviteByEmail:'الدعوة بالبريد الإلكتروني',sendInvitation:'إرسال الدعوة',
    copyInviteLink:'نسخ رابط الدعوة',linkCopied:'تم نسخ الرابط!',pendingInvite:'قيد الانتظار',
    members:'الأعضاء',member:'عضو',manager:'مدير',admin:'مسؤول',
    removeMember:'إزالة عضو',leaveGroup:'مغادرة المجموعة',deleteGroup:'حذف المجموعة',
    assignTo:'تعيين إلى',assignedTo:'معين إلى',unassigned:'غير معين',
    createdBy:'أنشأه',allTasks:'جميع المهام',myTasksFilter:'مهامي',filterUnassigned:'غير معين',
    confirmLogout:'هل أنت متأكد من تسجيل الخروج؟',
    confirmDeleteTask:'هل أنت متأكد من حذف هذه المهمة؟',
    confirmRemoveMember:'إزالة {name} من المجموعة؟',
    confirmLeaveGroup:'مغادرة "{group}"؟',
    confirmDeleteGroup:'حذف "{group}"؟ ستُفقد جميع المهام.',
    yes:'نعم',no:'لا',cancel:'إلغاء',
    noGroupsYet:'لا توجد مجموعات بعد — أنشئ واحدة للتعاون مع الأصدقاء!',
    markAllRead:'تحديد الكل كمقروء',joinGroup:'الانضمام للمجموعة',inviteAccepted:'انضممت إلى المجموعة!',
    roleChanged:'تم تحديث الدور',memberRemoved:'تمت إزالة العضو',taskAssigned:'تم تعيين المهمة',
    noNotifications:'لا توجد إشعارات بعد',
    notifTaskAssigned:'{name} عيّن لك "{task}" في {group}',
    notifTaskCompleted:'{name} أكمل "{task}" في {group}',
    notifGroupInvite:'{name} دعاك للانضمام إلى "{group}"',
    notifMemberJoined:'{name} انضم إلى "{group}"',
  },
  es: {
    appTitle:'Mis Tareas',add:'Agregar',filterAll:'Todo',filterActive:'Activo',filterDone:'Hecho',
    addTaskPlaceholder:'¿Qué hay que hacer?',
    clearCompleted:'Limpiar completadas',
    noTasks:'Sin tareas aún',noTasksSub:'Agrega algo arriba para empezar.',
    allDone:'¡Todo listo!',allDoneSub:'Todo está marcado.',
    noneCompleted:'Nada completado aún',noneCompletedSub:'Completa una tarea para verla aquí.',
    remaining:n=>`${n} tarea${n!==1?'s':''} pendiente${n!==1?'s':''}`,completed:n=>`${n} completada${n!==1?'s':''}`,
    priority:'Prioridad',priorityNone:'Ninguna',priorityLow:'Baja',priorityMedium:'Media',priorityHigh:'Alta',
    description:'Notas',descriptionPlaceholder:'Agregar notas…',
    time:'Tiempo',created:'Creado',completedAt:'Completado',took:'Tomó',
    ago:'hace',justNow:'ahora mismo',
    subtasks:'Subtareas',addSubtask:'Agregar subtarea…',
    deleteTask:'Eliminar tarea',save:'Guardar',close:'Cerrar',
    notifyOnDone:'🔔 Notificar al terminar',
    notifEmail:'Notif. por email',notifEmailDesc:'Recibir actualizaciones por email',
    notifEmailDailySummary:'Resumen diario por email',notifEmailTaskCompleted:'Tarea completada por email',notifEmailWeeklyReport:'Informe semanal por email',
    durFmt:(m,h,d)=>d>0?`${d}d ${h%24}h`:h>0?`${h}h ${m%60}m`:`${m} min`,
    deleteConfirm:'¿Eliminar esta tarea?',
    logout:'Cerrar sesión',languages:'Idiomas',notifications:'Notificaciones',
    loginTitle:'Mis Tareas',loginSubtitle:'Gestión de tareas simple y elegante.',
    continueWithGoogle:'Continuar con Google',
    notifTaskReminders:'Recordatorios',notifTaskRemindersDesc:'Recordar antes de la fecha límite',
    notifDailyDigest:'Resumen diario',notifDailyDigestDesc:'Resumen matutino de tareas',
    notifTaskCompleted:'Tarea completada',notifTaskCompletedDesc:'Notificación al completar tarea',
    notifOverdueTasks:'Alertas de retraso',notifOverdueTasksDesc:'Alertas para tareas vencidas',
    notifWeeklyReport:'Informe semanal',notifWeeklyReportDesc:'Resumen semanal de productividad',
    notifSound:'Sonido',notifSoundDesc:'Reproducir sonido en notificaciones',
    notifBadge:'Contador',notifBadgeDesc:'Mostrar contador en la pestaña',
    doNotDisturb:'No molestar',doNotDisturbDesc:'Silenciar todas las notificaciones',
    taskDone:'Hecho',
    charts:'Análisis',totalTasks:'Total',completed:'Completadas',pending:'Pendientes',avgTime:'Tiempo medio',chartPie:'Tarta',chartDoughnut:'Dona',chartBar:'Por prioridad',chartHBar:'Horizontal',chartLine:'Tendencia',chartPolar:'Polar',last7:'Últimos 7 días',last30:'Últimos 30 días',backToTasks:'← Tareas',noData:'Sin datos aún',
    groups:'Grupos',myGroups:'Mis Grupos',newGroup:'Nuevo Grupo',createGroup:'Crear Grupo',
    groupName:'Nombre del grupo',groupDescription:'Descripción',groupColor:'Color',
    inviteMember:'Invitar miembro',inviteByEmail:'Invitar por correo',sendInvitation:'Enviar invitación',
    copyInviteLink:'Copiar enlace',linkCopied:'¡Enlace copiado!',pendingInvite:'Pendiente',
    members:'Miembros',member:'Miembro',manager:'Gerente',admin:'Administrador',
    removeMember:'Eliminar miembro',leaveGroup:'Salir del grupo',deleteGroup:'Eliminar grupo',
    assignTo:'Asignar a',assignedTo:'Asignado a',unassigned:'Sin asignar',
    createdBy:'Creado por',allTasks:'Todas las tareas',myTasksFilter:'Mis tareas',filterUnassigned:'Sin asignar',
    confirmLogout:'¿Estás seguro de que quieres cerrar sesión?',
    confirmDeleteTask:'¿Estás seguro de que quieres eliminar esta tarea?',
    confirmRemoveMember:'¿Eliminar a {name} de este grupo?',
    confirmLeaveGroup:'¿Salir de "{group}"?',
    confirmDeleteGroup:'¿Eliminar "{group}"? Se perderán todas las tareas.',
    yes:'Sí',no:'No',cancel:'Cancelar',
    noGroupsYet:'Aún no hay grupos — ¡crea uno para colaborar con amigos!',
    markAllRead:'Marcar todo como leído',joinGroup:'Unirse al grupo',inviteAccepted:'¡Te has unido al grupo!',
    roleChanged:'Rol actualizado',memberRemoved:'Miembro eliminado',taskAssigned:'Tarea asignada',
    noNotifications:'No hay notificaciones aún',
    notifTaskAssigned:'{name} te asignó "{task}" en {group}',
    notifTaskCompleted:'{name} completó "{task}" en {group}',
    notifGroupInvite:'{name} te invitó a unirte a "{group}"',
    notifMemberJoined:'{name} se unió a "{group}"',
  },
  fr: {
    appTitle:'Mes Tâches',add:'Ajouter',filterAll:'Tout',filterActive:'Actif',filterDone:'Fait',
    addTaskPlaceholder:'Que faut-il faire ?',
    clearCompleted:'Effacer terminées',
    noTasks:'Aucune tâche pour l\'instant',noTasksSub:'Ajoutez quelque chose ci-dessus.',
    allDone:'Tout est fait !',allDoneSub:'Tout est coché.',
    noneCompleted:'Rien de terminé',noneCompletedSub:'Terminez une tâche pour la voir ici.',
    remaining:n=>`${n} tâche${n!==1?'s':''} restante${n!==1?'s':''}`,completed:n=>`${n} terminée${n!==1?'s':''}`,
    priority:'Priorité',priorityNone:'Aucune',priorityLow:'Basse',priorityMedium:'Moyenne',priorityHigh:'Haute',
    description:'Notes',descriptionPlaceholder:'Ajouter des notes…',
    time:'Temps',created:'Créé',completedAt:'Terminé',took:'A pris',
    ago:'il y a',justNow:'à l\'instant',
    subtasks:'Sous-tâches',addSubtask:'Ajouter une sous-tâche…',
    deleteTask:'Supprimer la tâche',save:'Enregistrer',close:'Fermer',
    notifyOnDone:'🔔 Notifier à la fin',
    notifEmail:'Notif. par email',notifEmailDesc:'Recevoir des mises à jour par email',
    notifEmailDailySummary:'Résumé quotidien par email',notifEmailTaskCompleted:'Tâche terminée par email',notifEmailWeeklyReport:'Rapport hebdo par email',
    durFmt:(m,h,d)=>d>0?`${d}j ${h%24}h`:h>0?`${h}h ${m%60}min`:`${m} min`,
    deleteConfirm:'Supprimer cette tâche ?',
    logout:'Se déconnecter',languages:'Langues',notifications:'Notifications',
    loginTitle:'Mes Tâches',loginSubtitle:'Gestion de tâches simple et élégante.',
    continueWithGoogle:'Continuer avec Google',
    notifTaskReminders:'Rappels',notifTaskRemindersDesc:'Rappeler avant l\'échéance',
    notifDailyDigest:'Résumé quotidien',notifDailyDigestDesc:'Résumé matinal des tâches',
    notifTaskCompleted:'Tâche terminée',notifTaskCompletedDesc:'Notification à la complétion',
    notifOverdueTasks:'Alertes retard',notifOverdueTasksDesc:'Alertes pour tâches en retard',
    notifWeeklyReport:'Rapport hebdo',notifWeeklyReportDesc:'Résumé hebdomadaire',
    notifSound:'Son',notifSoundDesc:'Jouer un son pour les notifications',
    notifBadge:'Compteur',notifBadgeDesc:'Afficher le compteur dans l\'onglet',
    doNotDisturb:'Ne pas déranger',doNotDisturbDesc:'Silencer toutes les notifications',
    taskDone:'Fait',
    charts:'Analyses',totalTasks:'Total',completed:'Terminées',pending:'En attente',avgTime:'Temps moyen',chartPie:'Camembert',chartDoughnut:'Donut',chartBar:'Par priorité',chartHBar:'Horizontal',chartLine:'Tendance',chartPolar:'Polaire',last7:'7 derniers jours',last30:'30 derniers jours',backToTasks:'← Tâches',noData:'Aucune donnée',
    groups:'Groupes',myGroups:'Mes Groupes',newGroup:'Nouveau Groupe',createGroup:'Créer un groupe',
    groupName:'Nom du groupe',groupDescription:'Description',groupColor:'Couleur',
    inviteMember:'Inviter un membre',inviteByEmail:'Inviter par email',sendInvitation:'Envoyer l\'invitation',
    copyInviteLink:'Copier le lien',linkCopied:'Lien copié !',pendingInvite:'En attente',
    members:'Membres',member:'Membre',manager:'Gestionnaire',admin:'Administrateur',
    removeMember:'Retirer le membre',leaveGroup:'Quitter le groupe',deleteGroup:'Supprimer le groupe',
    assignTo:'Assigner à',assignedTo:'Assigné à',unassigned:'Non assigné',
    createdBy:'Créé par',allTasks:'Toutes les tâches',myTasksFilter:'Mes tâches',filterUnassigned:'Non assigné',
    confirmLogout:'Êtes-vous sûr de vouloir vous déconnecter ?',
    confirmDeleteTask:'Êtes-vous sûr de vouloir supprimer cette tâche ?',
    confirmRemoveMember:'Retirer {name} de ce groupe ?',
    confirmLeaveGroup:'Quitter "{group}" ?',
    confirmDeleteGroup:'Supprimer "{group}" ? Toutes les tâches seront perdues.',
    yes:'Oui',no:'Non',cancel:'Annuler',
    noGroupsYet:'Aucun groupe encore — créez-en un pour collaborer avec des amis !',
    markAllRead:'Tout marquer comme lu',joinGroup:'Rejoindre le groupe',inviteAccepted:'Vous avez rejoint le groupe !',
    roleChanged:'Rôle mis à jour',memberRemoved:'Membre retiré',taskAssigned:'Tâche assignée',
    noNotifications:'Aucune notification pour l\'instant',
    notifTaskAssigned:'{name} vous a assigné "{task}" dans {group}',
    notifTaskCompleted:'{name} a terminé "{task}" dans {group}',
    notifGroupInvite:'{name} vous a invité à rejoindre "{group}"',
    notifMemberJoined:'{name} a rejoint "{group}"',
  },
  de: {
    appTitle:'Meine Aufgaben',add:'Hinzufügen',filterAll:'Alle',filterActive:'Aktiv',filterDone:'Erledigt',
    addTaskPlaceholder:'Was muss getan werden?',
    clearCompleted:'Erledigte löschen',
    noTasks:'Noch keine Aufgaben',noTasksSub:'Füge oben etwas hinzu.',
    allDone:'Alles erledigt!',allDoneSub:'Alles ist abgehakt.',
    noneCompleted:'Noch nichts erledigt',noneCompletedSub:'Erledige eine Aufgabe, um sie hier zu sehen.',
    remaining:n=>`${n} Aufgabe${n!==1?'n':''} ausstehend`,completed:n=>`${n} erledigt`,
    priority:'Priorität',priorityNone:'Keine',priorityLow:'Niedrig',priorityMedium:'Mittel',priorityHigh:'Hoch',
    description:'Notizen',descriptionPlaceholder:'Notizen hinzufügen…',
    time:'Zeit',created:'Erstellt',completedAt:'Abgeschlossen',took:'Dauer',
    ago:'vor',justNow:'gerade eben',
    subtasks:'Unteraufgaben',addSubtask:'Unteraufgabe hinzufügen…',
    deleteTask:'Aufgabe löschen',save:'Speichern',close:'Schließen',
    notifyOnDone:'🔔 Benachrichtigen wenn fertig',
    notifEmail:'E-Mail-Benachricht.',notifEmailDesc:'Updates per E-Mail erhalten',
    notifEmailDailySummary:'Tägliche Zusammenfassung',notifEmailTaskCompleted:'Aufgabe abgeschlossen',notifEmailWeeklyReport:'Wochenbericht per E-Mail',
    durFmt:(m,h,d)=>d>0?`${d}T ${h%24}Std`:h>0?`${h}Std ${m%60}Min`:`${m} Min`,
    deleteConfirm:'Diese Aufgabe löschen?',
    logout:'Abmelden',languages:'Sprachen',notifications:'Benachrichtigungen',
    loginTitle:'Meine Aufgaben',loginSubtitle:'Einfaches und elegantes Aufgabenmanagement.',
    continueWithGoogle:'Mit Google fortfahren',
    notifTaskReminders:'Aufgabenerinnerungen',notifTaskRemindersDesc:'Vor Fälligkeitsdatum erinnern',
    notifDailyDigest:'Tägliche Zusammenfassung',notifDailyDigestDesc:'Morgendliche Aufgabenübersicht',
    notifTaskCompleted:'Aufgabe erledigt',notifTaskCompletedDesc:'Toast bei Erledigung',
    notifOverdueTasks:'Überfällige Aufgaben',notifOverdueTasksDesc:'Warnungen für überfällige Aufgaben',
    notifWeeklyReport:'Wochenbericht',notifWeeklyReportDesc:'Wöchentliche Produktivitätsübersicht',
    notifSound:'Ton',notifSoundDesc:'Ton für Benachrichtigungen',
    notifBadge:'Badge-Zähler',notifBadgeDesc:'Aufgabenanzahl im Tab anzeigen',
    doNotDisturb:'Nicht stören',doNotDisturbDesc:'Alle Benachrichtigungen stummschalten',
    taskDone:'Erledigt',
    charts:'Analysen',totalTasks:'Gesamt',completed:'Abgeschlossen',pending:'Ausstehend',avgTime:'Durchschn. Zeit',chartPie:'Kuchendiagramm',chartDoughnut:'Donut',chartBar:'Nach Priorität',chartHBar:'Horizontal',chartLine:'Verlauf',chartPolar:'Polar',last7:'Letzte 7 Tage',last30:'Letzte 30 Tage',backToTasks:'← Aufgaben',noData:'Keine Daten',
    groups:'Gruppen',myGroups:'Meine Gruppen',newGroup:'Neue Gruppe',createGroup:'Gruppe erstellen',
    groupName:'Gruppenname',groupDescription:'Beschreibung',groupColor:'Farbe',
    inviteMember:'Mitglied einladen',inviteByEmail:'Per E-Mail einladen',sendInvitation:'Einladung senden',
    copyInviteLink:'Einladungslink kopieren',linkCopied:'Link kopiert!',pendingInvite:'Ausstehend',
    members:'Mitglieder',member:'Mitglied',manager:'Manager',admin:'Administrator',
    removeMember:'Mitglied entfernen',leaveGroup:'Gruppe verlassen',deleteGroup:'Gruppe löschen',
    assignTo:'Zuweisen an',assignedTo:'Zugewiesen an',unassigned:'Nicht zugewiesen',
    createdBy:'Erstellt von',allTasks:'Alle Aufgaben',myTasksFilter:'Meine Aufgaben',filterUnassigned:'Nicht zugewiesen',
    confirmLogout:'Möchten Sie sich wirklich abmelden?',
    confirmDeleteTask:'Möchten Sie diese Aufgabe wirklich löschen?',
    confirmRemoveMember:'{name} aus dieser Gruppe entfernen?',
    confirmLeaveGroup:'"{group}" verlassen?',
    confirmDeleteGroup:'"{group}" löschen? Alle Aufgaben gehen verloren.',
    yes:'Ja',no:'Nein',cancel:'Abbrechen',
    noGroupsYet:'Noch keine Gruppen — erstellen Sie eine, um mit Freunden zusammenzuarbeiten!',
    markAllRead:'Alle als gelesen markieren',joinGroup:'Gruppe beitreten',inviteAccepted:'Sie sind der Gruppe beigetreten!',
    roleChanged:'Rolle aktualisiert',memberRemoved:'Mitglied entfernt',taskAssigned:'Aufgabe zugewiesen',
    noNotifications:'Noch keine Benachrichtigungen',
    notifTaskAssigned:'{name} hat Ihnen "{task}" in {group} zugewiesen',
    notifTaskCompleted:'{name} hat "{task}" in {group} abgeschlossen',
    notifGroupInvite:'{name} hat Sie eingeladen, "{group}" beizutreten',
    notifMemberJoined:'{name} ist "{group}" beigetreten',
  },
  ru: {
    appTitle:'Мои Задачи',add:'Добавить',filterAll:'Все',filterActive:'Активные',filterDone:'Готово',
    addTaskPlaceholder:'Что нужно сделать?',
    clearCompleted:'Очистить выполненные',
    noTasks:'Задач пока нет',noTasksSub:'Добавьте что-нибудь выше.',
    allDone:'Всё готово!',allDoneSub:'Все задачи выполнены.',
    noneCompleted:'Ничего не выполнено',noneCompletedSub:'Выполните задачу, чтобы увидеть её здесь.',
    remaining:n=>`Осталось ${n} задач`,completed:n=>`${n} выполнено`,
    priority:'Приоритет',priorityNone:'Нет',priorityLow:'Низкий',priorityMedium:'Средний',priorityHigh:'Высокий',
    description:'Заметки',descriptionPlaceholder:'Добавить заметки…',
    time:'Время',created:'Создано',completedAt:'Выполнено',took:'Затрачено',
    ago:'назад',justNow:'только что',
    subtasks:'Подзадачи',addSubtask:'Добавить подзадачу…',
    deleteTask:'Удалить задачу',save:'Сохранить',close:'Закрыть',
    notifyOnDone:'🔔 Уведомить при выполнении',
    notifEmail:'Email-уведомления',notifEmailDesc:'Получать обновления на email',
    notifEmailDailySummary:'Ежедневный отчёт на email',notifEmailTaskCompleted:'Задача выполнена — email',notifEmailWeeklyReport:'Еженедельный отчёт на email',
    durFmt:(m,h,d)=>d>0?`${d} дн`:h>0?`${h} ч ${m%60} мин`:`${m} мин`,
    deleteConfirm:'Удалить эту задачу?',
    logout:'Выйти',languages:'Языки',notifications:'Уведомления',
    loginTitle:'Мои Задачи',loginSubtitle:'Простое и красивое управление задачами.',
    continueWithGoogle:'Войти через Google',
    notifTaskReminders:'Напоминания',notifTaskRemindersDesc:'Напоминать перед дедлайном',
    notifDailyDigest:'Дайджест',notifDailyDigestDesc:'Утренний обзор задач',
    notifTaskCompleted:'Задача выполнена',notifTaskCompletedDesc:'Уведомление при выполнении',
    notifOverdueTasks:'Просроченные',notifOverdueTasksDesc:'Предупреждения о просроченных задачах',
    notifWeeklyReport:'Еженедельный отчёт',notifWeeklyReportDesc:'Еженедельная статистика',
    notifSound:'Звук',notifSoundDesc:'Звук для уведомлений',
    notifBadge:'Счётчик',notifBadgeDesc:'Показывать счётчик в заголовке',
    doNotDisturb:'Не беспокоить',doNotDisturbDesc:'Отключить все уведомления',
    taskDone:'Готово',
    charts:'Аналитика',totalTasks:'Всего',completed:'Выполнено',pending:'В ожидании',avgTime:'Среднее время',chartPie:'Круговая',chartDoughnut:'Пончик',chartBar:'По приоритету',chartHBar:'Горизонт.',chartLine:'Тренд',chartPolar:'Полярная',last7:'Последние 7 дней',last30:'Последние 30 дней',backToTasks:'← Задачи',noData:'Нет данных',
    groups:'Группы',myGroups:'Мои группы',newGroup:'Новая группа',createGroup:'Создать группу',
    groupName:'Название группы',groupDescription:'Описание',groupColor:'Цвет',
    inviteMember:'Пригласить участника',inviteByEmail:'Пригласить по email',sendInvitation:'Отправить приглашение',
    copyInviteLink:'Скопировать ссылку',linkCopied:'Ссылка скопирована!',pendingInvite:'Ожидает',
    members:'Участники',member:'Участник',manager:'Менеджер',admin:'Администратор',
    removeMember:'Удалить участника',leaveGroup:'Покинуть группу',deleteGroup:'Удалить группу',
    assignTo:'Назначить',assignedTo:'Назначено',unassigned:'Не назначено',
    createdBy:'Создано',allTasks:'Все задачи',myTasksFilter:'Мои задачи',filterUnassigned:'Без исполнителя',
    confirmLogout:'Вы уверены, что хотите выйти?',
    confirmDeleteTask:'Вы уверены, что хотите удалить эту задачу?',
    confirmRemoveMember:'Удалить {name} из группы?',
    confirmLeaveGroup:'Покинуть "{group}"?',
    confirmDeleteGroup:'Удалить "{group}"? Все задачи будут потеряны.',
    yes:'Да',no:'Нет',cancel:'Отмена',
    noGroupsYet:'Пока нет групп — создайте одну для совместной работы!',
    markAllRead:'Отметить все прочитанными',joinGroup:'Присоединиться к группе',inviteAccepted:'Вы присоединились к группе!',
    roleChanged:'Роль обновлена',memberRemoved:'Участник удалён',taskAssigned:'Задача назначена',
    noNotifications:'Нет уведомлений',
    notifTaskAssigned:'{name} назначил вам "{task}" в {group}',
    notifTaskCompleted:'{name} выполнил "{task}" в {group}',
    notifGroupInvite:'{name} пригласил вас в "{group}"',
    notifMemberJoined:'{name} присоединился к "{group}"',
  },
  pt: {
    appTitle:'Minhas Tarefas',add:'Adicionar',filterAll:'Todos',filterActive:'Ativo',filterDone:'Feito',
    addTaskPlaceholder:'O que precisa ser feito?',
    clearCompleted:'Limpar concluídas',
    noTasks:'Nenhuma tarefa ainda',noTasksSub:'Adicione algo acima para começar.',
    allDone:'Tudo feito!',allDoneSub:'Tudo está marcado.',
    noneCompleted:'Nada concluído ainda',noneCompletedSub:'Conclua uma tarefa para vê-la aqui.',
    remaining:n=>`${n} tarefa${n!==1?'s':''} restante${n!==1?'s':''}`,completed:n=>`${n} concluída${n!==1?'s':''}`,
    priority:'Prioridade',priorityNone:'Nenhuma',priorityLow:'Baixa',priorityMedium:'Média',priorityHigh:'Alta',
    description:'Notas',descriptionPlaceholder:'Adicionar notas…',
    time:'Tempo',created:'Criado',completedAt:'Concluído',took:'Levou',
    ago:'atrás',justNow:'agora mesmo',
    subtasks:'Subtarefas',addSubtask:'Adicionar subtarefa…',
    deleteTask:'Excluir tarefa',save:'Salvar',close:'Fechar',
    notifyOnDone:'🔔 Notificar ao concluir',
    notifEmail:'Notif. por email',notifEmailDesc:'Receber atualizações por email',
    notifEmailDailySummary:'Resumo diário por email',notifEmailTaskCompleted:'Tarefa concluída por email',notifEmailWeeklyReport:'Relatório semanal por email',
    durFmt:(m,h,d)=>d>0?`${d}d ${h%24}h`:h>0?`${h}h ${m%60}min`:`${m} min`,
    deleteConfirm:'Excluir esta tarefa?',
    logout:'Sair',languages:'Idiomas',notifications:'Notificações',
    loginTitle:'Minhas Tarefas',loginSubtitle:'Gestão de tarefas simples e elegante.',
    continueWithGoogle:'Continuar com o Google',
    notifTaskReminders:'Lembretes',notifTaskRemindersDesc:'Lembrar antes do prazo',
    notifDailyDigest:'Resumo diário',notifDailyDigestDesc:'Resumo matinal das tarefas',
    notifTaskCompleted:'Tarefa concluída',notifTaskCompletedDesc:'Toast ao concluir tarefa',
    notifOverdueTasks:'Alertas de atraso',notifOverdueTasksDesc:'Alertas para tarefas atrasadas',
    notifWeeklyReport:'Relatório semanal',notifWeeklyReportDesc:'Resumo semanal de produtividade',
    notifSound:'Som',notifSoundDesc:'Reproduzir som para notificações',
    notifBadge:'Contador',notifBadgeDesc:'Mostrar contagem na aba',
    doNotDisturb:'Não perturbe',doNotDisturbDesc:'Silenciar todas as notificações',
    taskDone:'Feito',
    charts:'Análises',totalTasks:'Total',completed:'Concluídas',pending:'Pendentes',avgTime:'Tempo médio',chartPie:'Pizza',chartDoughnut:'Donuts',chartBar:'Por prioridade',chartHBar:'Horizontal',chartLine:'Tendência',chartPolar:'Polar',last7:'Últimos 7 dias',last30:'Últimos 30 dias',backToTasks:'← Tarefas',noData:'Sem dados',
    groups:'Grupos',myGroups:'Meus Grupos',newGroup:'Novo Grupo',createGroup:'Criar Grupo',
    groupName:'Nome do grupo',groupDescription:'Descrição',groupColor:'Cor',
    inviteMember:'Convidar membro',inviteByEmail:'Convidar por email',sendInvitation:'Enviar convite',
    copyInviteLink:'Copiar link',linkCopied:'Link copiado!',pendingInvite:'Pendente',
    members:'Membros',member:'Membro',manager:'Gerente',admin:'Administrador',
    removeMember:'Remover membro',leaveGroup:'Sair do grupo',deleteGroup:'Excluir grupo',
    assignTo:'Atribuir a',assignedTo:'Atribuído a',unassigned:'Sem atribuição',
    createdBy:'Criado por',allTasks:'Todas as tarefas',myTasksFilter:'Minhas tarefas',filterUnassigned:'Sem atribuição',
    confirmLogout:'Tem certeza que deseja sair?',
    confirmDeleteTask:'Tem certeza que deseja excluir esta tarefa?',
    confirmRemoveMember:'Remover {name} deste grupo?',
    confirmLeaveGroup:'Sair de "{group}"?',
    confirmDeleteGroup:'Excluir "{group}"? Todas as tarefas serão perdidas.',
    yes:'Sim',no:'Não',cancel:'Cancelar',
    noGroupsYet:'Nenhum grupo ainda — crie um para colaborar com amigos!',
    markAllRead:'Marcar tudo como lido',joinGroup:'Entrar no grupo',inviteAccepted:'Você entrou no grupo!',
    roleChanged:'Função atualizada',memberRemoved:'Membro removido',taskAssigned:'Tarefa atribuída',
    noNotifications:'Sem notificações ainda',
    notifTaskAssigned:'{name} atribuiu "{task}" a você em {group}',
    notifTaskCompleted:'{name} concluiu "{task}" em {group}',
    notifGroupInvite:'{name} convidou você para entrar em "{group}"',
    notifMemberJoined:'{name} entrou em "{group}"',
  },
  zh: {
    appTitle:'我的任务',add:'添加',filterAll:'全部',filterActive:'进行中',filterDone:'已完成',
    addTaskPlaceholder:'需要做什么？',
    clearCompleted:'清除已完成',
    noTasks:'暂无任务',noTasksSub:'在上方添加任务开始。',
    allDone:'全部完成！',allDoneSub:'所有任务已勾选。',
    noneCompleted:'尚未完成',noneCompletedSub:'完成一项任务即可在此查看。',
    remaining:n=>`剩余 ${n} 项任务`,completed:n=>`已完成 ${n} 项`,
    priority:'优先级',priorityNone:'无',priorityLow:'低',priorityMedium:'中',priorityHigh:'高',
    description:'备注',descriptionPlaceholder:'添加备注…',
    time:'时间',created:'创建于',completedAt:'完成于',took:'耗时',
    ago:'前',justNow:'刚刚',
    subtasks:'子任务',addSubtask:'添加子任务…',
    deleteTask:'删除任务',save:'保存',close:'关闭',
    notifyOnDone:'🔔 完成时通知',
    notifEmail:'邮件通知',notifEmailDesc:'通过邮件接收更新',
    notifEmailDailySummary:'每日摘要邮件',notifEmailTaskCompleted:'任务完成邮件',notifEmailWeeklyReport:'每周报告邮件',
    durFmt:(m,h,d)=>d>0?`${d}天`:h>0?`${h}小时${m%60}分`:`${m}分钟`,
    deleteConfirm:'删除此任务？',
    logout:'退出',languages:'语言',notifications:'通知',
    loginTitle:'我的任务',loginSubtitle:'简单、优雅的任务管理。',
    continueWithGoogle:'使用 Google 继续',
    notifTaskReminders:'任务提醒',notifTaskRemindersDesc:'在任务到期前提醒',
    notifDailyDigest:'每日摘要',notifDailyDigestDesc:'今日任务的早间摘要',
    notifTaskCompleted:'任务完成',notifTaskCompletedDesc:'完成任务时显示通知',
    notifOverdueTasks:'逾期提醒',notifOverdueTasksDesc:'逾期任务的提醒',
    notifWeeklyReport:'周报',notifWeeklyReportDesc:'每周效率摘要',
    notifSound:'通知音效',notifSoundDesc:'通知时播放声音',
    notifBadge:'角标计数',notifBadgeDesc:'在标签标题中显示任务数',
    doNotDisturb:'勿扰模式',doNotDisturbDesc:'静音所有通知',
    taskDone:'完成',
    charts:'统计',totalTasks:'总任务',completed:'已完成',pending:'待完成',avgTime:'平均时间',chartPie:'饼图',chartDoughnut:'环形图',chartBar:'按优先级',chartHBar:'横向柱图',chartLine:'趋势',chartPolar:'极坐标',last7:'最近7天',last30:'最近30天',backToTasks:'← 任务',noData:'暂无数据',
    groups:'群组',myGroups:'我的群组',newGroup:'新建群组',createGroup:'创建群组',
    groupName:'群组名称',groupDescription:'描述',groupColor:'颜色',
    inviteMember:'邀请成员',inviteByEmail:'通过邮件邀请',sendInvitation:'发送邀请',
    copyInviteLink:'复制邀请链接',linkCopied:'链接已复制！',pendingInvite:'待处理',
    members:'成员',member:'成员',manager:'管理员',admin:'超级管理员',
    removeMember:'移除成员',leaveGroup:'退出群组',deleteGroup:'删除群组',
    assignTo:'分配给',assignedTo:'已分配给',unassigned:'未分配',
    createdBy:'创建者',allTasks:'所有任务',myTasksFilter:'我的任务',filterUnassigned:'未分配',
    confirmLogout:'确定要退出登录吗？',
    confirmDeleteTask:'确定要删除此任务吗？',
    confirmRemoveMember:'从此群组移除 {name}？',
    confirmLeaveGroup:'退出"{group}"？',
    confirmDeleteGroup:'删除"{group}"？所有任务将丢失。',
    yes:'是',no:'否',cancel:'取消',
    noGroupsYet:'还没有群组 — 创建一个与朋友协作吧！',
    markAllRead:'全部标为已读',joinGroup:'加入群组',inviteAccepted:'您已加入群组！',
    roleChanged:'角色已更新',memberRemoved:'成员已移除',taskAssigned:'任务已分配',
    noNotifications:'暂无通知',
    notifTaskAssigned:'{name} 在 {group} 中将"{task}"分配给您',
    notifTaskCompleted:'{name} 在 {group} 中完成了"{task}"',
    notifGroupInvite:'{name} 邀请您加入"{group}"',
    notifMemberJoined:'{name} 加入了"{group}"',
  },
  ja: {
    appTitle:'マイタスク',add:'追加',filterAll:'すべて',filterActive:'進行中',filterDone:'完了',
    addTaskPlaceholder:'何をすべきですか？',
    clearCompleted:'完了済みをクリア',
    noTasks:'タスクはまだありません',noTasksSub:'上に何かを追加して始めましょう。',
    allDone:'すべて完了！',allDoneSub:'すべてチェックされています。',
    noneCompleted:'まだ完了していません',noneCompletedSub:'タスクを完了するとここに表示されます。',
    remaining:n=>`${n}件のタスクが残っています`,completed:n=>`${n}件完了`,
    priority:'優先度',priorityNone:'なし',priorityLow:'低',priorityMedium:'中',priorityHigh:'高',
    description:'メモ',descriptionPlaceholder:'メモを追加…',
    time:'時間',created:'作成',completedAt:'完了',took:'所要時間',
    ago:'前',justNow:'たった今',
    subtasks:'サブタスク',addSubtask:'サブタスクを追加…',
    deleteTask:'タスクを削除',save:'保存',close:'閉じる',
    notifyOnDone:'🔔 完了時に通知',
    notifEmail:'メール通知',notifEmailDesc:'メールで更新を受け取る',
    notifEmailDailySummary:'毎日のサマリーメール',notifEmailTaskCompleted:'タスク完了メール',notifEmailWeeklyReport:'週次レポートメール',
    durFmt:(m,h,d)=>d>0?`${d}日`:h>0?`${h}時間${m%60}分`:`${m}分`,
    deleteConfirm:'このタスクを削除しますか？',
    logout:'ログアウト',languages:'言語',notifications:'通知',
    loginTitle:'マイタスク',loginSubtitle:'シンプルで美しいタスク管理。',
    continueWithGoogle:'Googleで続ける',
    notifTaskReminders:'タスクリマインダー',notifTaskRemindersDesc:'期限前にリマインド',
    notifDailyDigest:'デイリーダイジェスト',notifDailyDigestDesc:'今日のタスクの朝のまとめ',
    notifTaskCompleted:'タスク完了',notifTaskCompletedDesc:'タスク完了時にトーストを表示',
    notifOverdueTasks:'期限切れアラート',notifOverdueTasksDesc:'期限切れタスクのアラート',
    notifWeeklyReport:'週次レポート',notifWeeklyReportDesc:'週次生産性サマリー',
    notifSound:'通知音',notifSoundDesc:'通知時にサウンドを再生',
    notifBadge:'バッジカウント',notifBadgeDesc:'タブタイトルにカウントを表示',
    doNotDisturb:'おやすみモード',doNotDisturbDesc:'すべての通知をミュート',
    taskDone:'完了',
    charts:'分析',totalTasks:'合計',completed:'完了',pending:'未完了',avgTime:'平均時間',chartPie:'円グラフ',chartDoughnut:'ドーナツ',chartBar:'優先度別',chartHBar:'横棒グラフ',chartLine:'トレンド',chartPolar:'極座標',last7:'過去7日間',last30:'過去30日間',backToTasks:'← タスク',noData:'データなし',
    groups:'グループ',myGroups:'マイグループ',newGroup:'新しいグループ',createGroup:'グループを作成',
    groupName:'グループ名',groupDescription:'説明',groupColor:'カラー',
    inviteMember:'メンバーを招待',inviteByEmail:'メールで招待',sendInvitation:'招待を送る',
    copyInviteLink:'招待リンクをコピー',linkCopied:'リンクをコピーしました！',pendingInvite:'保留中',
    members:'メンバー',member:'メンバー',manager:'マネージャー',admin:'管理者',
    removeMember:'メンバーを削除',leaveGroup:'グループを退出',deleteGroup:'グループを削除',
    assignTo:'担当者',assignedTo:'担当者',unassigned:'未割当',
    createdBy:'作成者',allTasks:'すべてのタスク',myTasksFilter:'自分のタスク',filterUnassigned:'未割当',
    confirmLogout:'本当にログアウトしますか？',
    confirmDeleteTask:'このタスクを削除してもよいですか？',
    confirmRemoveMember:'{name} をこのグループから削除しますか？',
    confirmLeaveGroup:'"{group}" を退出しますか？',
    confirmDeleteGroup:'"{group}" を削除しますか？すべてのタスクが失われます。',
    yes:'はい',no:'いいえ',cancel:'キャンセル',
    noGroupsYet:'まだグループがありません — 友達と協力するために作成しましょう！',
    markAllRead:'すべて既読にする',joinGroup:'グループに参加',inviteAccepted:'グループに参加しました！',
    roleChanged:'役割が更新されました',memberRemoved:'メンバーが削除されました',taskAssigned:'タスクが割り当てられました',
    noNotifications:'通知はまだありません',
    notifTaskAssigned:'{name} が {group} で "{task}" をあなたに割り当てました',
    notifTaskCompleted:'{name} が {group} で "{task}" を完了しました',
    notifGroupInvite:'{name} があなたを "{group}" に招待しました',
    notifMemberJoined:'{name} が "{group}" に参加しました',
  },
};

const t = key => {
  const dict = TL[state.lang] || TL.en;
  const val = dict[key];
  return val !== undefined ? val : (TL.en[key] || key);
};

// ─── Default settings ─────────────────────────────────────────────────────────
const DEFAULT_SETTINGS = {
  language: 'en',
  notifications: {
    dailyDigest: false,
    emailNotifications: false,
    emailTypes: { dailySummary: true, taskCompleted: false, weeklyReport: false },
    weeklyReport: false,
    notificationSound: true,
  },
};

// ─── Time helpers ─────────────────────────────────────────────────────────────
function relativeTime(ts) {
  if (!ts) return '';
  const diff = Date.now() - ts;
  const mins = Math.floor(diff / 60000);
  const hrs  = Math.floor(diff / 3600000);
  const days = Math.floor(diff / 86400000);
  if (mins < 1)  return t('justNow');
  if (mins < 60) return `${mins}m ${t('ago')}`;
  if (hrs  < 24) return `${hrs}h ${t('ago')}`;
  return `${days}d ${t('ago')}`;
}

function duration(from, to) {
  if (!from || !to) return '';
  const diff = to - from;
  const mins = Math.floor(diff / 60000);
  const hrs  = Math.floor(diff / 3600000);
  const days = Math.floor(diff / 86400000);
  const fmt  = TL[state.lang]?.durFmt || TL.en.durFmt;
  return fmt(mins, hrs, days);
}

// BCP-47 locale tags for each supported language code
const LOCALE_MAP = {
  en:'en-US', he:'he-IL', ar:'ar-SA', es:'es-ES',
  fr:'fr-FR', de:'de-DE', ru:'ru-RU', pt:'pt-BR',
  zh:'zh-CN', ja:'ja-JP',
};
function langLocale() { return LOCALE_MAP[state.lang] || state.lang; }

function absTime(ts) {
  if (!ts) return '';
  return new Date(ts).toLocaleString(langLocale(), { month:'short', day:'numeric', hour:'2-digit', minute:'2-digit' });
}

// ─── API ──────────────────────────────────────────────────────────────────────
async function apiLoad() {
  const r = await fetch('/api/todos');
  if (r.status === 401) { location.href = '/login'; return []; }
  return r.json();
}

async function apiSave() {
  await fetch('/api/todos', {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify(state.todos),
  });
}

async function apiLoadSettings() {
  try {
    const r = await fetch('/api/settings');
    if (r.ok) return r.json();
  } catch {}
  return DEFAULT_SETTINGS;
}

async function apiSaveSettings() {
  try {
    await fetch('/api/settings', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(state.settings),
    });
  } catch {}
}

// ─── Confirmation dialog ──────────────────────────────────────────────────────
function confirmAction({ title, message, confirmText = 'Confirm', confirmColor = '#EF4444', onConfirm }) {
  document.getElementById('confirmModal')?.remove();
  const el = document.createElement('div');
  el.id = 'confirmModal';
  el.className = 'confirm-overlay';
  el.innerHTML = `
    <div class="confirm-card">
      <div class="confirm-icon">⚠️</div>
      <div class="confirm-title">${title}</div>
      <div class="confirm-msg">${message}</div>
      <div class="confirm-actions">
        <button class="confirm-cancel" id="confirmCancel">${TL[state.lang]?.cancel || 'Cancel'}</button>
        <button class="confirm-ok" id="confirmOk" style="background:${confirmColor}">${confirmText}</button>
      </div>
    </div>`;
  document.body.appendChild(el);
  requestAnimationFrame(() => el.classList.add('open'));
  const close = () => { el.classList.remove('open'); setTimeout(() => el.remove(), 200); };
  el.querySelector('#confirmCancel').onclick = close;
  el.querySelector('#confirmOk').onclick = () => { close(); onConfirm(); };
  el.addEventListener('click', e => { if (e.target === el) close(); });
  document.addEventListener('keydown', function esc(e) {
    if (e.key === 'Escape') { close(); document.removeEventListener('keydown', esc); }
  });
}

// ─── Groups API ───────────────────────────────────────────────────────────────
async function apiLoadGroups() {
  const r = await fetch('/api/groups');
  if (!r.ok) return [];
  return r.json();
}

async function apiCreateGroup(data) {
  const r = await fetch('/api/groups', {
    method: 'POST', headers: {'Content-Type':'application/json'},
    body: JSON.stringify(data)
  });
  return r.json();
}

async function apiLoadGroup(id) {
  const r = await fetch(`/api/groups/${id}`);
  return r.json();
}

async function apiUpdateGroup(id, data) {
  await fetch(`/api/groups/${id}`, {
    method: 'PUT', headers: {'Content-Type':'application/json'},
    body: JSON.stringify(data)
  });
}

async function apiDeleteGroup(id) {
  await fetch(`/api/groups/${id}`, { method: 'DELETE' });
}

async function apiAddGroupTask(groupId, data) {
  const r = await fetch(`/api/groups/${groupId}/tasks`, {
    method: 'POST', headers: {'Content-Type':'application/json'},
    body: JSON.stringify(data)
  });
  return r.json();
}

async function apiUpdateGroupTask(groupId, taskId, data) {
  await fetch(`/api/groups/${groupId}/tasks/${taskId}`, {
    method: 'PUT', headers: {'Content-Type':'application/json'},
    body: JSON.stringify(data)
  });
}

async function apiDeleteGroupTask(groupId, taskId) {
  await fetch(`/api/groups/${groupId}/tasks/${taskId}`, { method: 'DELETE' });
}

async function apiInviteMember(groupId, email, role) {
  const r = await fetch(`/api/groups/${groupId}/invite`, {
    method: 'POST', headers: {'Content-Type':'application/json'},
    body: JSON.stringify({email, role})
  });
  return r.json();
}

async function apiChangeMemberRole(groupId, userId, role) {
  await fetch(`/api/groups/${groupId}/members/${userId}`, {
    method: 'PUT', headers: {'Content-Type':'application/json'},
    body: JSON.stringify({role})
  });
}

async function apiRemoveMember(groupId, userId) {
  await fetch(`/api/groups/${groupId}/members/${userId}`, { method: 'DELETE' });
}

async function apiLoadNotifications() {
  const r = await fetch('/api/notifications');
  if (!r.ok) return [];
  return r.json();
}

async function apiMarkNotifsRead(all = false, ids = []) {
  await fetch('/api/notifications/read', {
    method: 'POST', headers: {'Content-Type':'application/json'},
    body: JSON.stringify(all ? {all:true} : {ids})
  });
}

// ─── Notifications ────────────────────────────────────────────────────────────
async function loadNotifications() {
  state.notifications = await apiLoadNotifications();
  state.unreadCount = state.notifications.filter(n => !n.read).length;
  updateNotifBell();
  updateTabTitle();
}

function updateNotifBell() {
  const badge = document.getElementById('notifBadge');
  if (badge) {
    badge.textContent = state.unreadCount || '';
    badge.style.display = state.unreadCount ? '' : 'none';
  }
}

function updateTabTitle() {
  document.title = state.unreadCount > 0 ? `(${state.unreadCount}) My Tasks` : 'My Tasks';
}

function timeAgo(ts) {
  const s = Math.floor((Date.now()-ts)/1000);
  if (s<60) return 'just now';
  if (s<3600) return Math.floor(s/60)+'m ago';
  if (s<86400) return Math.floor(s/3600)+'h ago';
  return Math.floor(s/86400)+'d ago';
}

function formatNotifText(n, tl) {
  const tpl = (key, vars) => {
    let s = tl[key] || key;
    Object.entries(vars).forEach(([k,v]) => s = s.replace(`{${k}}`, v||''));
    return s;
  };
  switch(n.type) {
    case 'task_assigned': return tpl('notifTaskAssigned', {name:n.fromUser||'',task:n.taskText||'',group:n.groupName||''});
    case 'task_completed': return tpl('notifTaskCompleted', {name:n.fromUser||'',task:n.taskText||'',group:n.groupName||''});
    case 'group_invite': return tpl('notifGroupInvite', {name:n.fromUser||'',group:n.groupName||''});
    case 'member_joined': return tpl('notifMemberJoined', {name:n.fromUser||'',group:n.groupName||''});
    default: return n.type;
  }
}

function renderNotifDropdown() {
  const tl = TL[state.lang] || TL.en;
  document.getElementById('notifDropdown')?.remove();
  const el = document.createElement('div');
  el.id = 'notifDropdown';
  el.className = 'notif-dropdown';
  const notifs = state.notifications.slice(0,20);
  el.innerHTML = `
    <div class="notif-dropdown-header">
      <span>${tl.notifications||'Notifications'}</span>
      ${notifs.length ? `<button id="markAllReadBtn" class="link-btn">${tl.markAllRead||'Mark all as read'}</button>` : ''}
    </div>
    <div class="notif-dropdown-list">
      ${notifs.length ? notifs.map(n => `
        <div class="notif-drop-item${n.read?'':' unread'}" data-nid="${n._id}">
          <div class="notif-drop-text">${formatNotifText(n, tl)}</div>
          <div class="notif-drop-time">${timeAgo(n.createdAt)}</div>
        </div>`).join('') : `<div class="notif-empty">${tl.noNotifications||'No notifications yet'}</div>`}
    </div>`;
  document.getElementById('navRight')?.appendChild(el);
  document.getElementById('markAllReadBtn')?.addEventListener('click', async () => {
    await apiMarkNotifsRead(true);
    await loadNotifications();
    el.remove();
  });
  setTimeout(() => {
    document.addEventListener('click', function closeDD(e) {
      if (!el.contains(e.target) && e.target.id !== 'notifBellBtn') {
        el.remove(); document.removeEventListener('click', closeDD);
      }
    });
  }, 0);
}

// ─── Groups page ──────────────────────────────────────────────────────────────
async function showGroupsPage() {
  state.groupsView = true;
  state.activeGroup = null;
  document.getElementById('mainContent').style.display = 'none';
  document.getElementById('groupBoardPage').style.display = 'none';
  document.getElementById('groupsPage').style.display = '';
  const groups = await apiLoadGroups();
  renderGroupsList(groups);
}

function renderGroupsList(groups) {
  const container = document.getElementById('groupsList');
  const tl = TL[state.lang] || TL.en;
  if (!groups.length) {
    container.innerHTML = `<div class="empty"><div class="empty-icon">👥</div><div class="empty-title">${tl.noGroupsYet||'No groups yet'}</div></div>`;
    return;
  }
  container.innerHTML = groups.map(g => {
    const myMember = g.members?.find(m => m.userId === window.__USER__?.id);
    const role = myMember?.role || 'member';
    const activeMembers = g.members?.filter(m => m.status==='active') || [];
    const pending = g.members?.filter(m => m.status==='pending') || [];
    const avatars = activeMembers.slice(0,5).map(m =>
      m.picture ? `<img class="gm-avatar" src="${m.picture}" title="${m.name}">` :
      `<div class="gm-avatar gm-avatar-fb" title="${m.name}">${(m.name||'?')[0].toUpperCase()}</div>`
    ).join('') + (activeMembers.length > 5 ? `<div class="gm-avatar gm-avatar-more">+${activeMembers.length-5}</div>` : '');
    return `<div class="group-card" data-gid="${g._id}" style="--g-color:${g.color}">
      <div class="group-card-stripe"></div>
      <div class="group-card-body">
        <div class="group-card-top">
          <span class="group-card-name">${g.name}</span>
          <span class="role-badge role-${role}">${tl[role] || role}</span>
        </div>
        ${g.description ? `<div class="group-card-desc">${g.description}</div>` : ''}
        <div class="group-card-meta">
          <div class="gm-avatars">${avatars}</div>
          <span class="group-card-stats">${g.taskCount} tasks · ${g.doneCount} done</span>
          ${pending.length ? `<span class="pending-badge">${pending.length} pending</span>` : ''}
        </div>
      </div>
    </div>`;
  }).join('');
  container.querySelectorAll('.group-card').forEach(card => {
    card.addEventListener('click', () => openGroupBoard(card.dataset.gid));
  });
}

function showCreateGroupModal() {
  const tl = TL[state.lang] || TL.en;
  const colors = ['#3B82F6','#8B5CF6','#EC4899','#EF4444','#F59E0B','#10B981','#6366F1','#14B8A6'];
  document.getElementById('createGroupModal')?.remove();
  const el = document.createElement('div');
  el.id = 'createGroupModal';
  el.className = 'confirm-overlay';
  el.innerHTML = `
    <div class="confirm-card modal-wide">
      <div class="confirm-title">${tl.createGroup||'Create Group'}</div>
      <input class="modal-input" id="cgName" placeholder="${tl.groupName||'Group Name'}" maxlength="60">
      <input class="modal-input" id="cgDesc" placeholder="${tl.groupDescription||'Description'}" maxlength="200">
      <div class="color-picker-row" id="cgColors">
        ${colors.map((c,i) => `<button class="color-dot${i===0?' active':''}" data-color="${c}" style="background:${c}"></button>`).join('')}
      </div>
      <div class="confirm-actions">
        <button class="confirm-cancel" id="cgCancel">${tl.cancel||'Cancel'}</button>
        <button class="confirm-ok" id="cgCreate">${tl.createGroup||'Create Group'}</button>
      </div>
    </div>`;
  document.body.appendChild(el);
  requestAnimationFrame(() => el.classList.add('open'));
  let selectedColor = colors[0];
  el.querySelectorAll('.color-dot').forEach(b => b.addEventListener('click', () => {
    el.querySelectorAll('.color-dot').forEach(x => x.classList.remove('active'));
    b.classList.add('active');
    selectedColor = b.dataset.color;
  }));
  const close = () => { el.classList.remove('open'); setTimeout(() => el.remove(), 200); };
  el.querySelector('#cgCancel').onclick = close;
  el.querySelector('#cgCreate').onclick = async () => {
    const name = el.querySelector('#cgName').value.trim();
    if (!name) { el.querySelector('#cgName').focus(); return; }
    const result = await apiCreateGroup({ name, description: el.querySelector('#cgDesc').value.trim(), color: selectedColor });
    close();
    if (result._id) openGroupBoard(result._id);
  };
  el.addEventListener('click', e => { if (e.target === el) close(); });
}

// ─── Group board ──────────────────────────────────────────────────────────────
async function openGroupBoard(groupId) {
  const g = await apiLoadGroup(groupId);
  state.activeGroup = g;
  state.groupFilter = 'all';
  state.groupSort = 'newest';
  document.getElementById('mainContent').style.display = 'none';
  document.getElementById('groupsPage').style.display = 'none';
  document.getElementById('groupBoardPage').style.display = '';
  renderGroupBoard();
}

function renderGroupBoard() {
  const g = state.activeGroup;
  const tl = TL[state.lang] || TL.en;
  const myRole = g.myRole;
  const userId = window.__USER__?.id;

  document.getElementById('gbName').textContent = g.name;
  document.getElementById('gbName').style.color = g.color;

  const activeMembers = g.members.filter(m => m.status==='active');
  document.getElementById('gbMembers').innerHTML = activeMembers.slice(0,6).map(m =>
    m.picture ? `<img class="gm-avatar" src="${m.picture}" title="${m.name}">` :
    `<div class="gm-avatar gm-avatar-fb" title="${m.name}">${(m.name||'?')[0].toUpperCase()}</div>`
  ).join('');

  document.getElementById('gbInviteBtn').style.display = myRole==='admin' ? '' : 'none';
  document.getElementById('gbSettingsBtn').style.display = myRole==='admin' ? '' : 'none';

  const assignOpts = myRole==='admin'||myRole==='manager'
    ? activeMembers.map(m => `<option value="${m.userId}"${m.userId===userId?' selected':''}>${m.name}</option>`).join('')
    : `<option value="${userId}">${window.__USER__?.name}</option>`;
  document.getElementById('gbAssignSelect').innerHTML = `<option value="">${tl.unassigned||'Unassigned'}</option>${assignOpts}`;
  if (myRole === 'member') document.getElementById('gbAssignSelect').disabled = true;

  updateGbFilterBtns();
  renderGroupTaskList();
}

function getFilteredGroupTasks() {
  const g = state.activeGroup;
  const userId = window.__USER__?.id;
  let tasks = [...(g.tasks || [])];
  if (state.groupFilter === 'mine') tasks = tasks.filter(tk => tk.assignedTo === userId);
  if (state.groupFilter === 'unassigned') tasks = tasks.filter(tk => !tk.assignedTo);
  if (state.groupSort === 'priority') {
    const pOrd = {high:0,medium:1,low:2};
    tasks.sort((a,b) => (pOrd[a.priority]??3) - (pOrd[b.priority]??3));
  } else if (state.groupSort === 'assignee') {
    tasks.sort((a,b) => (a.assignedTo||'').localeCompare(b.assignedTo||''));
  } else {
    tasks.sort((a,b) => b.createdAt - a.createdAt);
  }
  return tasks;
}

function renderGroupTaskList() {
  const g = state.activeGroup;
  const tl = TL[state.lang] || TL.en;
  const userId = window.__USER__?.id;
  const myRole = g.myRole;
  const tasks = getFilteredGroupTasks();
  const members = g.members.filter(m=>m.status==='active');
  const getMember = id => members.find(m=>m.userId===id);

  document.getElementById('gbTaskList').innerHTML = tasks.length ? tasks.map(task => {
    const assignee = getMember(task.assignedTo);
    const pColors = {high:'#EF4444',medium:'#F59E0B',low:'#6366F1',none:'#D1D5DB'};
    const canDelete = myRole==='admin'||myRole==='manager'||task.createdBy===userId;
    return `<div class="group-task-row${task.done?' gt-done':''}" data-tid="${task.id}">
      <button class="task-cb${task.done?' ticked':''}" data-gtcheck="${task.id}" aria-label="Toggle done">
        ${task.done?`<svg width="12" height="12" viewBox="0 0 24 24" fill="none" stroke="white" stroke-width="3" stroke-linecap="round"><polyline points="20 6 9 12 4 10"/></svg>`:''}
      </button>
      <span class="gt-title">${task.text}</span>
      <span class="gt-assignee">
        ${assignee ? (assignee.picture ? `<img class="gm-avatar sm" src="${assignee.picture}">` : `<div class="gm-avatar gm-avatar-fb sm">${(assignee.name||'?')[0]}</div>`) + `<span>${assignee.name}</span>` : `<span class="gt-unassigned">${tl.unassigned||'Unassigned'}</span>`}
      </span>
      <span class="gt-priority" style="background:${pColors[task.priority]||pColors.none}"></span>
      ${canDelete ? `<button class="gt-del" data-gtdel="${task.id}" aria-label="Delete">✕</button>` : ''}
    </div>`;
  }).join('') : `<div class="empty"><div class="empty-icon">✅</div><div class="empty-title">No tasks yet</div></div>`;

  document.getElementById('gbTaskList').querySelectorAll('[data-gtcheck]').forEach(btn => {
    btn.addEventListener('click', async e => {
      e.stopPropagation();
      const task = g.tasks.find(tk => tk.id === btn.dataset.gtcheck);
      if (!task) return;
      if (myRole === 'member' && task.assignedTo !== userId) return;
      task.done = !task.done;
      task.completedAt = task.done ? Date.now() : null;
      renderGroupTaskList();
      await apiUpdateGroupTask(g._id, task.id, {done: task.done});
    });
  });

  document.getElementById('gbTaskList').querySelectorAll('[data-gtdel]').forEach(btn => {
    btn.addEventListener('click', async e => {
      e.stopPropagation();
      const taskId = btn.dataset.gtdel;
      const task = g.tasks.find(tk => tk.id === taskId);
      confirmAction({
        title: tl.confirmDeleteTask || 'Delete Task',
        message: `"${task?.text}"`,
        confirmText: tl.yes || 'Yes',
        onConfirm: async () => {
          g.tasks = g.tasks.filter(tk => tk.id !== taskId);
          renderGroupTaskList();
          await apiDeleteGroupTask(g._id, taskId);
        }
      });
    });
  });
}

function updateGbFilterBtns() {
  ['All','Mine','Unassigned'].forEach(f => {
    document.getElementById('gbFilter'+f)?.classList.toggle('active', state.groupFilter===f.toLowerCase());
  });
}

function showInviteModal() {
  const g = state.activeGroup;
  const tl = TL[state.lang] || TL.en;
  document.getElementById('inviteModal')?.remove();
  const el = document.createElement('div');
  el.id = 'inviteModal';
  el.className = 'confirm-overlay';
  el.innerHTML = `
    <div class="confirm-card modal-wide">
      <div class="confirm-title">${tl.inviteMember||'Invite Member'}</div>
      <input class="modal-input" id="invEmail" type="email" placeholder="${tl.inviteByEmail||'Invite by email'}">
      <select class="modal-input" id="invRole">
        <option value="member">${tl.member||'Member'}</option>
        <option value="manager">${tl.manager||'Manager'}</option>
      </select>
      <div id="invLinkRow" style="display:none">
        <div class="invite-link-box" id="invLinkBox"></div>
        <div class="confirm-actions">
          <button class="confirm-cancel" id="invCopyBtn">${tl.copyInviteLink||'Copy Invite Link'}</button>
          <button class="confirm-ok" id="invEmailBtn">📧 ${tl.sendInvitation||'Send Invitation'}</button>
        </div>
      </div>
      <div class="confirm-actions" id="invActions">
        <button class="confirm-cancel" id="invCancel">${tl.cancel||'Cancel'}</button>
        <button class="confirm-ok" id="invSend">${tl.sendInvitation||'Send Invitation'}</button>
      </div>
    </div>`;
  document.body.appendChild(el);
  requestAnimationFrame(() => el.classList.add('open'));
  const close = () => { el.classList.remove('open'); setTimeout(() => el.remove(), 200); };
  el.querySelector('#invCancel').onclick = close;
  el.querySelector('#invSend').onclick = async () => {
    const email = el.querySelector('#invEmail').value.trim();
    if (!email) return;
    const role = el.querySelector('#invRole').value;
    const res = await apiInviteMember(g._id, email, role);
    if (res.inviteUrl) {
      el.querySelector('#invLinkBox').textContent = res.inviteUrl;
      el.querySelector('#invLinkRow').style.display = '';
      el.querySelector('#invActions').style.display = 'none';
      el.querySelector('#invCopyBtn').onclick = () => {
        navigator.clipboard?.writeText(res.inviteUrl);
        showToast(tl.linkCopied||'Link copied!', 'success');
      };
      el.querySelector('#invEmailBtn').onclick = () => {
        const subject = encodeURIComponent(`Join my group on MyTasks!`);
        const body = encodeURIComponent(`Hi! I'm inviting you to join our group "${g.name}" on MyTasks.\n\nClick here to join: ${res.inviteUrl}`);
        window.open(`mailto:${email}?subject=${subject}&body=${body}`);
      };
      const updated = await apiLoadGroup(g._id);
      state.activeGroup = updated;
    }
  };
  el.addEventListener('click', e => { if (e.target === el) close(); });
}

function showMembersPanel() {
  let g = state.activeGroup;
  const tl = TL[state.lang] || TL.en;
  const userId = window.__USER__?.id;
  const myRole = g.myRole;
  document.getElementById('membersModal')?.remove();
  const el = document.createElement('div');
  el.id = 'membersModal';
  el.className = 'confirm-overlay';
  el.innerHTML = `
    <div class="confirm-card modal-wide members-modal">
      <div class="confirm-title">${tl.members||'Members'}</div>
      <div id="membersList"></div>
      <div class="confirm-actions">
        <button class="confirm-ok" id="membersClose">${tl.cancel||'Cancel'}</button>
      </div>
    </div>`;
  document.body.appendChild(el);
  requestAnimationFrame(() => el.classList.add('open'));
  const close = () => { el.classList.remove('open'); setTimeout(() => el.remove(), 200); };
  el.querySelector('#membersClose').onclick = close;
  el.addEventListener('click', e => { if (e.target === el) close(); });

  const renderList = () => {
    el.querySelector('#membersList').innerHTML = g.members.map(m => {
      const isMe = m.userId === userId;
      const isPending = m.status === 'pending';
      const avatar = m.picture ? `<img class="gm-avatar" src="${m.picture}">` : `<div class="gm-avatar gm-avatar-fb">${(m.name||'?')[0].toUpperCase()}</div>`;
      const roleSelect = myRole==='admin' && !isMe && !isPending
        ? `<select class="role-select" data-uid="${m.userId}">
            <option value="member"${m.role==='member'?' selected':''}>${tl.member||'Member'}</option>
            <option value="manager"${m.role==='manager'?' selected':''}>${tl.manager||'Manager'}</option>
            <option value="admin"${m.role==='admin'?' selected':''}>${tl.admin||'Admin'}</option>
           </select>`
        : `<span class="role-badge role-${m.role}">${tl[m.role]||m.role}</span>`;
      const actions = myRole==='admin' && !isMe
        ? `<button class="gt-del" data-rmuid="${m.userId||m.email}" data-rmname="${m.name}" title="${tl.removeMember||'Remove'}">🗑️</button>`
        : (isMe && myRole!=='admin' ? `<button class="leave-btn" data-leaveuid="${m.userId}">${tl.leaveGroup||'Leave'}</button>` : '');
      return `<div class="member-row">
        ${avatar}
        <div class="member-info">
          <div class="member-name">${m.name}</div>
          <div class="member-email">${m.email}</div>
        </div>
        ${isPending ? `<span class="pending-badge">${tl.pendingInvite||'Pending'}</span>` : ''}
        ${roleSelect}
        ${actions}
      </div>`;
    }).join('');

    el.querySelectorAll('.role-select').forEach(sel => {
      sel.addEventListener('change', async () => {
        await apiChangeMemberRole(g._id, sel.dataset.uid, sel.value);
        const updated = await apiLoadGroup(g._id);
        state.activeGroup = updated; g = updated;
        showToast(tl.roleChanged||'Role updated', 'success');
      });
    });

    el.querySelectorAll('[data-rmuid]').forEach(btn => {
      btn.addEventListener('click', () => {
        confirmAction({
          title: tl.removeMember||'Remove Member',
          message: (tl.confirmRemoveMember||'Remove {name}?').replace('{name}', btn.dataset.rmname),
          confirmText: tl.yes||'Yes',
          onConfirm: async () => {
            await apiRemoveMember(g._id, btn.dataset.rmuid);
            const updated = await apiLoadGroup(g._id);
            state.activeGroup = updated; g = updated;
            renderList();
            renderGroupBoard();
            showToast(tl.memberRemoved||'Member removed', 'success');
          }
        });
      });
    });

    el.querySelectorAll('[data-leaveuid]').forEach(btn => {
      btn.addEventListener('click', () => {
        confirmAction({
          title: tl.leaveGroup||'Leave Group',
          message: (tl.confirmLeaveGroup||'Leave "{group}"?').replace('{group}', g.name),
          confirmText: tl.yes||'Yes',
          onConfirm: async () => {
            await apiRemoveMember(g._id, btn.dataset.leaveuid);
            close();
            showGroupsPage();
          }
        });
      });
    });
  };
  renderList();
}

// ─── Data migration ───────────────────────────────────────────────────────────
function migrateTodo(raw) {
  return {
    id:          raw.id          || Date.now(),
    text:        raw.text        || '',
    done:        !!raw.done,
    priority:    raw.priority    || 'none',
    description: raw.description || '',
    tags:        raw.tags        || [],
    subtasks:    (raw.subtasks   || []).map(s => ({
      id:          s.id          || Date.now() + Math.random(),
      text:        s.text        || '',
      done:        !!s.done,
      createdAt:   s.createdAt   || Date.now(),
      completedAt: s.completedAt || null,
    })),
    createdAt:   raw.createdAt   || Date.now(),
    completedAt: raw.completedAt || null,
  };
}

// ─── Confetti ─────────────────────────────────────────────────────────────────
function burst(x, y, count = 12) {
  if (window.matchMedia('(prefers-reduced-motion: reduce)').matches) return;
  const colors = ['#6366F1','#8B5CF6','#EC4899','#F59E0B','#EF4444','#10B981','#FBBF24','#3B82F6'];
  for (let i = 0; i < count; i++) {
    const el = document.createElement('div');
    el.className = 'cp';
    const sz = 5 + Math.random() * 5;
    const isCircle = Math.random() > 0.5;
    el.style.cssText = `left:${x}px;top:${y}px;background:${colors[i % colors.length]};width:${sz}px;height:${sz}px;border-radius:${isCircle ? '50%' : '2px'}`;
    document.body.appendChild(el);
    const tx = (Math.random() - 0.5) * 120;
    const ty = -(Math.random() * 100 + 30);
    el.animate([
      { transform: 'translate(0,0) rotate(0deg) scale(1)', opacity: 1 },
      { transform: `translate(${tx}px,${ty}px) rotate(${Math.random()*540}deg) scale(0.3)`, opacity: 0 },
    ], { duration: 700 + Math.random() * 400, easing: 'cubic-bezier(0,0,0.2,1)', fill: 'forwards' })
      .finished.then(() => el.remove());
  }
}

// ─── Toast notification ───────────────────────────────────────────────────────
let toastTimer = null;
function showToast(msg, type = '') {
  const el = document.getElementById('toast');
  if (!el) return;
  el.textContent = msg;
  el.className = 'toast show' + (type ? ' toast-' + type : '');
  clearTimeout(toastTimer);
  toastTimer = setTimeout(() => el.classList.remove('show'), 2800);
}

// ─── Notification sound ───────────────────────────────────────────────────────
function playNotifSound() {
  if (!state.settings?.notifications?.notificationSound) return;
  try {
    const ctx = new (window.AudioContext || window.webkitAudioContext)();
    const osc = ctx.createOscillator();
    const gain = ctx.createGain();
    osc.connect(gain);
    gain.connect(ctx.destination);
    osc.frequency.setValueAtTime(880, ctx.currentTime);
    osc.frequency.exponentialRampToValueAtTime(660, ctx.currentTime + 0.15);
    gain.gain.setValueAtTime(0.08, ctx.currentTime);
    gain.gain.exponentialRampToValueAtTime(0.001, ctx.currentTime + 0.25);
    osc.start(ctx.currentTime);
    osc.stop(ctx.currentTime + 0.25);
  } catch {}
}

// ─── Badge count ──────────────────────────────────────────────────────────────
function updateBadge() {
  if (!state.settings?.notifications?.badgeCount) {
    document.title = t('appTitle');
    return;
  }
  const pending = state.todos.filter(x => !x.done).length;
  document.title = pending > 0 ? `(${pending}) ${t('appTitle')}` : t('appTitle');
}

// ─── i18n DOM update ──────────────────────────────────────────────────────────
function applyI18n() {
  document.querySelectorAll('[data-i18n]').forEach(el => {
    const key = el.dataset.i18n;
    const val = t(key);
    if (typeof val === 'string') el.textContent = val;
  });
  document.querySelectorAll('[data-i18n-placeholder]').forEach(el => {
    const key = el.dataset.i18nPlaceholder;
    el.placeholder = t(key);
  });
  // Page title
  if (document.getElementById('pageTitle')) {
    document.getElementById('pageTitle').textContent = t('appTitle');
  }
  updateBadge();
}

// ─── Language ─────────────────────────────────────────────────────────────────
function applyLanguage(code) {
  const langInfo = LANGS.find(l => l.code === code) || LANGS[0];
  state.lang = code;
  document.documentElement.lang = code;
  document.documentElement.dir  = langInfo.dir;
  if (state.settings) state.settings.language = code;
  localStorage.setItem('lang', code);
  localStorage.setItem('app_language', code);
  applyI18n();
  // Update drawer if open
  if (state.activeDrawer !== null) renderDrawer(state.activeDrawer);
  // Re-render task list (relative times change language)
  render();
  // Update language list checkmarks
  renderLangList();
}

// ─── Theme ────────────────────────────────────────────────────────────────────
function applyTheme(theme) {
  document.documentElement.dataset.theme = theme;
  const icon = document.getElementById('themeIcon');
  if (icon) {
    // Sun icon for dark (click to go light), Moon icon for light (click to go dark)
    icon.innerHTML = theme === 'dark'
      ? '<circle cx="12" cy="12" r="5"/><line x1="12" y1="1" x2="12" y2="3"/><line x1="12" y1="21" x2="12" y2="23"/><line x1="4.22" y1="4.22" x2="5.64" y2="5.64"/><line x1="18.36" y1="18.36" x2="19.78" y2="19.78"/><line x1="1" y1="12" x2="3" y2="12"/><line x1="21" y1="12" x2="23" y2="12"/><line x1="4.22" y1="19.78" x2="5.64" y2="18.36"/><line x1="18.36" y1="5.64" x2="19.78" y2="4.22"/>'
      : '<path d="M21 12.79A9 9 0 1 1 11.21 3 7 7 0 0 0 21 12.79z"/>';
  }
}

function toggleTheme() {
  const cur    = document.documentElement.dataset.theme;
  const isDark = cur === 'dark' || (!cur && window.matchMedia('(prefers-color-scheme:dark)').matches);
  const next   = isDark ? 'light' : 'dark';
  applyTheme(next);
  localStorage.setItem('theme', next);
}

// ─── Helpers ──────────────────────────────────────────────────────────────────
function esc(s) {
  return String(s || '').replace(/&/g,'&amp;').replace(/</g,'&lt;').replace(/>/g,'&gt;').replace(/"/g,'&quot;');
}

// ─── Task card HTML ───────────────────────────────────────────────────────────
function subBarHTML(todo) {
  const subs = todo.subtasks || [];
  if (!subs.length) return '';
  const done = subs.filter(s => s.done).length;
  const pct  = Math.round(done / subs.length * 100);
  return `<div class="sub-bar">
    <div class="sub-bar-track"><div class="sub-bar-fill" style="width:${pct}%"></div></div>
    <span class="sub-bar-label">${done}/${subs.length}</span>
  </div>`;
}

function taskCardHTML(todo) {
  const dur      = todo.done && todo.completedAt ? duration(todo.createdAt, todo.completedAt) : '';
  const p        = todo.priority || 'none';
  const blocked  = !todo.done && todo.subtasks && todo.subtasks.some(s => !s.done);
  return `<div class="task-card${todo.done ? ' done-card' : ''}" data-id="${todo.id}" data-p="${p}" role="button" tabindex="0">
  <div class="task-inner">
    <button class="task-cb${todo.done ? ' ticked' : ''}${blocked ? ' blocked' : ''}" data-check="${todo.id}" aria-label="${todo.done ? 'Mark incomplete' : 'Mark complete'}"${blocked ? ' title="Complete all sub-tasks first"' : ''}>
      <svg width="10" height="8" viewBox="0 0 10 8" fill="none">
        <path d="M1 4L3.5 6.5L9 1" stroke="white" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"/>
      </svg>
    </button>
    <div class="task-body">
      <div class="task-title">${esc(todo.text)}</div>
      <div class="task-meta">
        <span class="task-time">${relativeTime(todo.createdAt)}</span>
        ${dur ? `<span class="task-dur">${t('took')} ${dur}</span>` : ''}
      </div>
      ${subBarHTML(todo)}
    </div>
  </div>
</div>`;
}

function skeletonHTML() {
  return Array(3).fill(0).map((_, i) => `
    <div class="skel" style="animation-delay:${i * 0.1}s">
      <div class="skel-line" style="width:${[72,48,85][i]}%;margin-block-end:10px"></div>
      <div class="skel-line" style="width:30%"></div>
    </div>`).join('');
}

// ─── Intersection observer ────────────────────────────────────────────────────
const io = new IntersectionObserver(entries => {
  entries.forEach(e => {
    if (e.isIntersecting) { e.target.classList.add('in'); io.unobserve(e.target); }
  });
}, { threshold: 0.05 });

// ─── Main render ──────────────────────────────────────────────────────────────
function render() {
  // Hero
  document.getElementById('heroDate').textContent = new Date().toLocaleDateString(
    langLocale(), { weekday:'long', year:'numeric', month:'long', day:'numeric' }
  );

  // Progress
  const doneCount = state.todos.filter(x => x.done).length;
  const total     = state.todos.length;
  const pct       = total ? Math.round(doneCount / total * 100) : 0;
  document.getElementById('progFill').style.width  = pct + '%';
  document.getElementById('progPct').textContent   = pct + '%';
  document.getElementById('statsText').textContent = (typeof t('remaining') === 'function' ? t('remaining')(total - doneCount) : '') + ' · ' + (typeof t('completed') === 'function' ? t('completed')(doneCount) : '');
  document.getElementById('statsCount').textContent = total ? `${total - doneCount} / ${total}` : '';

  // Task list
  const visible = state.todos.filter(todo =>
    state.filter === 'all' ||
    (state.filter === 'done' ? todo.done : !todo.done)
  );

  const listEl = document.getElementById('taskList');
  if (!visible.length) {
    const emptyKeys = {
      all:    ['noTasks', 'noTasksSub'],
      active: ['allDone', 'allDoneSub'],
      done:   ['noneCompleted', 'noneCompletedSub'],
    };
    const [tk, sk] = emptyKeys[state.filter];
    listEl.innerHTML = `<div class="empty">
      <div class="empty-icon">${state.filter === 'done' ? '✦' : '○'}</div>
      <div class="empty-title">${t(tk)}</div>
      <div class="empty-sub">${t(sk)}</div>
    </div>`;
  } else {
    listEl.innerHTML = visible.map(taskCardHTML).join('');
    listEl.querySelectorAll('.task-card').forEach((el, i) => {
      el.style.transitionDelay = `${i * 0.05}s`;
      io.observe(el);
      requestAnimationFrame(() => requestAnimationFrame(() => el.classList.add('in')));
    });
  }

  applyI18n();
  updateBadge();
}

// ─── Live time refresh ────────────────────────────────────────────────────────
setInterval(() => {
  document.querySelectorAll('.task-time').forEach(el => {
    const card = el.closest('[data-id]');
    if (!card) return;
    const todo = state.todos.find(x => x.id === parseInt(card.dataset.id));
    if (todo) el.textContent = relativeTime(todo.createdAt);
  });
}, 60000);

// ─── Toggle complete ──────────────────────────────────────────────────────────
async function toggleTodo(id, checkEl) {
  const todo = state.todos.find(x => x.id === id);
  if (!todo) return;
  // Block marking done while subtasks remain incomplete
  if (!todo.done && todo.subtasks && todo.subtasks.some(s => !s.done)) return;
  todo.done        = !todo.done;
  todo.completedAt = todo.done ? Date.now() : null;
  if (todo.done) {
    if (checkEl) {
      const rect = checkEl.getBoundingClientRect();
      burst(rect.left + rect.width / 2, rect.top + rect.height / 2);
    }
    if (todo.notifyOnDone) {
      showToast(`✓ ${t('taskDone')}`, 'success');
      playNotifSound();
    }
  }
  render();
  await apiSave();
}

// ─── Charts ───────────────────────────────────────────────────────────────────
const CHART_COLORS = {
  done: '#22C55E',
  notDone: '#EF4444',
  priorityHigh: '#EF4444',
  priorityMedium: '#F59E0B',
  priorityLow: '#6366F1',
  priorityNone: '#9CA3AF',
};

let activeChartInstance = null;

function openCharts() {
  state.chartView = true;
  const el = document.getElementById('chartsView');
  if (el) { el.style.display = ''; }
  renderChartStats();
  renderActiveChart();
  applyI18n();
  history.pushState({ app: true }, '');
}

function closeCharts() {
  state.chartView = false;
  const el = document.getElementById('chartsView');
  if (el) { el.style.display = 'none'; }
  if (activeChartInstance) { activeChartInstance.destroy(); activeChartInstance = null; }
  history.pushState({ app: true }, '');
}

function renderChartStats() {
  const grid = document.getElementById('statsGrid');
  if (!grid) return;
  const todos = state.todos;
  const total = todos.length;
  const done = todos.filter(t => t.done).length;
  const pending = total - done;
  const completedPct = total > 0 ? Math.round(done / total * 100) : 0;

  // Avg completion time
  const durations = todos
    .filter(t => t.done && t.createdAt && t.completedAt)
    .map(t => t.completedAt - t.createdAt);
  let avgStr = '—';
  if (durations.length > 0) {
    const avgMs = durations.reduce((a, b) => a + b, 0) / durations.length;
    avgStr = formatDuration(avgMs);
  }

  grid.innerHTML = `
    <div class="stat-card">
      <div class="stat-label" data-i18n="totalTasks">${t('totalTasks')}</div>
      <div class="stat-value">${total}</div>
    </div>
    <div class="stat-card">
      <div class="stat-label" data-i18n="completed">${t('completed')}</div>
      <div class="stat-value">${done}</div>
      <div class="stat-sub">${completedPct}%</div>
    </div>
    <div class="stat-card">
      <div class="stat-label" data-i18n="pending">${t('pending')}</div>
      <div class="stat-value">${pending}</div>
    </div>
    <div class="stat-card">
      <div class="stat-label" data-i18n="avgTime">${t('avgTime')}</div>
      <div class="stat-value" style="font-size:1.1rem">${avgStr}</div>
    </div>
  `;
}

function formatDuration(ms) {
  const mins = Math.floor(ms / 60000);
  if (mins < 60) return `${mins}m`;
  const hrs = Math.floor(mins / 60);
  if (hrs < 24) return `${hrs}h ${mins % 60}m`;
  const days = Math.floor(hrs / 24);
  return `${days}d ${hrs % 24}h`;
}

function getChartBaseOptions(extraPlugins = {}) {
  return {
    responsive: true,
    maintainAspectRatio: true,
    plugins: {
      legend: {
        position: 'bottom',
        labels: {
          padding: 16,
          usePointStyle: true,
          font: { family: "'DM Sans', sans-serif", size: 13 },
          color: getComputedStyle(document.documentElement).getPropertyValue('--text-primary').trim() || '#1A1A1A',
        }
      },
      tooltip: {
        backgroundColor: 'rgba(0,0,0,0.8)',
        titleFont: { family: "'DM Sans', sans-serif" },
        bodyFont: { family: "'DM Sans', sans-serif" },
        cornerRadius: 8,
        padding: 12,
      },
      ...extraPlugins
    }
  };
}

function renderActiveChart() {
  const chartType = state.activeChart;

  // Destroy old chart
  if (activeChartInstance) { activeChartInstance.destroy(); activeChartInstance = null; }

  const canvas = document.getElementById('mainChart');
  const nodata = document.getElementById('chartNodata');
  if (!canvas) return;

  const todos = state.todos;
  if (todos.length === 0) {
    canvas.style.display = 'none';
    if (nodata) nodata.style.display = '';
    return;
  }
  canvas.style.display = '';
  if (nodata) nodata.style.display = 'none';

  const ctx = canvas.getContext('2d');

  if (chartType === 'pie') {
    const done = todos.filter(t => t.done).length;
    const notDone = todos.length - done;
    activeChartInstance = new Chart(ctx, {
      type: 'pie',
      data: {
        labels: [t('completed'), t('pending')],
        datasets: [{ data: [done, notDone], backgroundColor: [CHART_COLORS.done, CHART_COLORS.notDone], borderWidth: 2, borderColor: 'transparent', hoverOffset: 8 }]
      },
      options: getChartBaseOptions()
    });
  }

  else if (chartType === 'bar') {
    const priorities = ['high', 'medium', 'low', 'none'];
    const labels = priorities.map(p => t('priority' + p.charAt(0).toUpperCase() + p.slice(1)));
    const doneData    = priorities.map(p => todos.filter(x => (x.priority || 'none') === p && x.done).length);
    const notDoneData = priorities.map(p => todos.filter(x => (x.priority || 'none') === p && !x.done).length);
    const barColors = [CHART_COLORS.priorityHigh, CHART_COLORS.priorityMedium, CHART_COLORS.priorityLow, CHART_COLORS.priorityNone];
    activeChartInstance = new Chart(ctx, {
      type: 'bar',
      data: {
        labels,
        datasets: [
          { label: t('completed'),   data: doneData,    backgroundColor: barColors.map(c => c + 'CC'), borderRadius: 6 },
          { label: t('pending'),     data: notDoneData, backgroundColor: barColors.map(c => c + '55'), borderRadius: 6 }
        ]
      },
      options: {
        ...getChartBaseOptions(),
        scales: {
          x: { grid: { color: 'rgba(128,128,128,0.1)' }, ticks: { font: { family: "'DM Sans', sans-serif" } } },
          y: { beginAtZero: true, grid: { color: 'rgba(128,128,128,0.1)' }, ticks: { stepSize: 1, font: { family: "'DM Sans', sans-serif" } } }
        }
      }
    });
  }
}

// ─── Speech to Text ───────────────────────────────────────────────────────────
// Uses the browser's built-in Web Speech API (powered by Google on Chrome/Android,
// Siri on Safari) — no API key needed, supports all app languages.
const SpeechRecognition = window.SpeechRecognition || window.webkitSpeechRecognition;
let recognition = null;
let isListening = false;

// BCP-47 locale tags for speech recognition (same langs as UI)
const SPEECH_LOCALE_MAP = {
  en:'en-US', he:'he-IL', ar:'ar-SA', es:'es-ES',
  fr:'fr-FR', de:'de-DE', ru:'ru-RU', pt:'pt-BR',
  zh:'zh-CN', ja:'ja-JP',
};

function initSpeech() {
  if (!SpeechRecognition) return;
  recognition = new SpeechRecognition();
  recognition.continuous = false;
  recognition.interimResults = true;
  recognition.maxAlternatives = 1;

  recognition.onstart = () => {
    isListening = true;
    updateMicBtn(true);
  };

  recognition.onresult = e => {
    const transcript = Array.from(e.results)
      .map(r => r[0].transcript).join('');
    const inp = document.getElementById('addInput');
    if (inp) inp.value = transcript;
  };

  recognition.onend = () => {
    isListening = false;
    updateMicBtn(false);
    // Auto-submit if there's text
    const inp = document.getElementById('addInput');
    if (inp && inp.value.trim()) {
      inp.focus();
    }
  };

  recognition.onerror = e => {
    isListening = false;
    updateMicBtn(false);
    if (e.error !== 'no-speech' && e.error !== 'aborted') {
      showToast('🎤 ' + e.error);
    }
  };
}

function updateMicBtn(listening) {
  const btn = document.getElementById('micBtn');
  if (!btn) return;
  btn.classList.toggle('mic-active', listening);
  btn.setAttribute('aria-label', listening ? 'Stop listening' : 'Voice input');
}
function updateSubMicBtn(listening) {
  const btn = document.getElementById('subMicBtn');
  if (!btn) return;
  btn.classList.toggle('mic-active', listening);
}

function toggleSpeech() {
  if (!SpeechRecognition) {
    showToast('🎤 Speech not supported in this browser');
    return;
  }
  if (!recognition) initSpeech();
  if (isListening) {
    recognition.stop();
    return;
  }
  recognition.lang = SPEECH_LOCALE_MAP[state.lang] || 'en-US';
  const inp = document.getElementById('addInput');
  if (inp) inp.value = '';
  try { recognition.start(); } catch (_) { initSpeech(); recognition.start(); }
}

// ─── Add task ─────────────────────────────────────────────────────────────────
async function addTodo(text) {
  if (!text.trim()) return;
  const notifyCheck = document.getElementById('notifyDoneCheck');
  const notifyOnDone = notifyCheck ? notifyCheck.checked : false;
  const todo = migrateTodo({
    id: Date.now(), text: text.trim(), done: false,
    priority: state.newPriority, createdAt: Date.now(),
    notifyOnDone,
  });
  if (notifyCheck) notifyCheck.checked = false;
  state.todos.unshift(todo);
  resetPriorityPicker();
  render();
  // Confetti burst from add button
  const btn = document.getElementById('addSubmit');
  if (btn) {
    const r = btn.getBoundingClientRect();
    burst(r.left + r.width / 2, r.top + r.height / 2, 20);
  }
  // Bounce-in the new card
  const firstCard = document.querySelector('#taskList .task-card');
  if (firstCard) {
    firstCard.classList.add('card-new');
    firstCard.addEventListener('animationend', () => firstCard.classList.remove('card-new'), { once: true });
  }
  await apiSave();
}

function resetPriorityPicker() {
  state.newPriority = 'low';
  document.querySelectorAll('.add-p-btn').forEach(b =>
    b.classList.toggle('active', b.dataset.p === 'low')
  );
  document.getElementById('addDropdown').classList.remove('open');
}

// ─── Filter ───────────────────────────────────────────────────────────────────
function setFilter(f) {
  state.filter = f;
  document.querySelectorAll('.filter-btn').forEach(b =>
    b.classList.toggle('active', b.dataset.filter === f)
  );
  render();
}

// ─── Drawer ───────────────────────────────────────────────────────────────────
let saveDebounce = null;

function openDrawer(id) {
  const todo = state.todos.find(x => x.id === id);
  if (!todo) return;
  state.activeDrawer = id;
  renderDrawer(todo);
  document.getElementById('overlay').classList.add('open');
  document.body.style.overflow = 'hidden';
}

function closeDrawer() {
  flushDrawerSave();
  document.getElementById('overlay').classList.remove('open');
  document.body.style.overflow = '';
  state.activeDrawer = null;
}

function renderDrawer(todoOrId) {
  const todo = typeof todoOrId === 'number'
    ? state.todos.find(x => x.id === todoOrId)
    : todoOrId;
  if (!todo) return;

  const bar = document.getElementById('drawerPriorityBar');
  bar.removeAttribute('data-p');
  if (todo.priority && todo.priority !== 'none') bar.setAttribute('data-p', todo.priority);

  document.getElementById('drawerTitle').value       = todo.text;
  document.getElementById('drawerDesc').value        = todo.description || '';
  document.getElementById('drawerDesc').placeholder  = t('descriptionPlaceholder');

  // Priority chips
  ['none','low','medium','high'].forEach(p => {
    const btn = document.getElementById('dp_' + p);
    if (!btn) return;
    const isActive = todo.priority === p || (!todo.priority && p === 'none');
    btn.className = 'p-chip' + (isActive ? (p === 'none' ? ' active-none' : ' cur') : '');
  });

  // Time
  let timeHTML = `<div class="time-row"><span class="time-badge">${t('created')}</span>${absTime(todo.createdAt)}</div>`;
  if (todo.completedAt) {
    timeHTML += `<div class="time-row"><span class="time-badge">${t('completedAt')}</span>${absTime(todo.completedAt)}</div>`;
    timeHTML += `<div class="time-row"><span class="time-badge">${t('took')}</span>${duration(todo.createdAt, todo.completedAt)}</div>`;
  }
  document.getElementById('timeInfo').innerHTML = timeHTML;

  // Subtasks
  document.getElementById('subtaskInput').placeholder = t('addSubtask');
  renderSubtasks(todo);

  // Hide any active AI preview remains (no longer exists but guard)
  const aiPreview = document.getElementById('aiPreview');
  if (aiPreview) aiPreview.style.display = 'none';
}

function renderSubtasks(todo) {
  const subs  = todo.subtasks || [];
  const done  = subs.filter(s => s.done).length;
  const count = subs.length;

  document.getElementById('subtaskCount').textContent = count ? `${done}/${count}` : '';

  const wrap = document.getElementById('subProgressWrap');
  if (count > 0) {
    const pct = Math.round(done / count * 100);
    wrap.style.display = '';
    document.getElementById('subProgressFill').style.width  = pct + '%';
    document.getElementById('subProgressLabel').textContent = pct + '%';
  } else {
    wrap.style.display = 'none';
  }

  document.getElementById('subtaskList').innerHTML = subs.map(s => {
    const subDur = s.done && s.completedAt ? duration(s.createdAt, s.completedAt) : '';
    const subAge = relativeTime(s.createdAt);
    return `
    <div class="sub-item${s.done ? ' done-sub' : ''}">
      <button class="sub-cb${s.done ? ' ticked' : ''}" data-stoggle="${s.id}">
        <svg width="9" height="7" viewBox="0 0 9 7" fill="none">
          <path d="M1 3.5L3 5.5L8 1" stroke="white" stroke-width="1.8" stroke-linecap="round" stroke-linejoin="round"/>
        </svg>
      </button>
      <div class="sub-body">
        <span class="sub-text" contenteditable="true" data-sedit="${s.id}">${esc(s.text)}</span>
        <div class="sub-meta">
          <span class="sub-time">${subAge}</span>
          ${subDur ? `<span class="sub-dur">${t('took')} ${subDur}</span>` : ''}
        </div>
      </div>
      <button class="sub-del" data-sdel="${s.id}">
        <svg width="11" height="11" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2.5" stroke-linecap="round">
          <line x1="18" y1="6" x2="6" y2="18"/><line x1="6" y1="6" x2="18" y2="18"/>
        </svg>
      </button>
    </div>`;
  }).join('');
}

function flushDrawerSave() {
  if (saveDebounce) { clearTimeout(saveDebounce); saveDebounce = null; }
  if (state.activeDrawer === null) return;
  const todo = state.todos.find(x => x.id === state.activeDrawer);
  if (!todo) return;
  const titleEl = document.getElementById('drawerTitle');
  const descEl  = document.getElementById('drawerDesc');
  if (titleEl) todo.text        = titleEl.value.trim() || todo.text;
  if (descEl)  todo.description = descEl.value;
}

function scheduleDrawerSave() {
  if (saveDebounce) clearTimeout(saveDebounce);
  saveDebounce = setTimeout(async () => {
    flushDrawerSave();
    render();
    await apiSave();
  }, 800);
}

// ─── Profile menu ─────────────────────────────────────────────────────────────
let menuOpen = false;

function openMenu() {
  menuOpen = true;
  document.getElementById('profileMenu').classList.add('open');
  document.getElementById('profileBtn').setAttribute('aria-expanded', 'true');
  showMenuPanel('menuMain');
}

function closeMenu() {
  menuOpen = false;
  document.getElementById('profileMenu').classList.remove('open');
  document.getElementById('profileBtn').setAttribute('aria-expanded', 'false');
}

function showMenuPanel(id) {
  document.querySelectorAll('.menu-panel').forEach(p => p.classList.remove('active'));
  const panel = document.getElementById(id);
  if (panel) panel.classList.add('active');
}

// ─── Language list ────────────────────────────────────────────────────────────
function renderLangList() {
  const list = document.getElementById('langList');
  if (!list) return;
  list.innerHTML = LANGS.map(l => `
    <button class="lang-item${state.lang === l.code ? ' current' : ''}" data-lang="${l.code}">
      <span>${l.label}</span>
      ${state.lang === l.code ? '<span class="lang-check">✓</span>' : ''}
    </button>`).join('');

  list.querySelectorAll('.lang-item').forEach(btn => {
    btn.addEventListener('click', async () => {
      const code = btn.dataset.lang;
      applyLanguage(code);
      if (state.settings) {
        state.settings.language = code;
        await apiSaveSettings();
      }
      closeMenu();
    });
  });
}

// ─── Notification settings ────────────────────────────────────────────────────
const NOTIF_ITEMS = [
  { key: 'dailyDigest',       nameKey: 'notifDailyDigest',   descKey: 'notifDailyDigestDesc' },
  { key: 'emailNotifications',nameKey: 'notifEmail',         descKey: 'notifEmailDesc', hasSubmenu: true },
  { key: 'weeklyReport',      nameKey: 'notifWeeklyReport',  descKey: 'notifWeeklyReportDesc' },
  { key: 'notificationSound', nameKey: 'notifSound',         descKey: 'notifSoundDesc' },
];

const EMAIL_SUBTYPES = [
  { key: 'dailySummary',   nameKey: 'notifEmailDailySummary' },
  { key: 'taskCompleted',  nameKey: 'notifEmailTaskCompleted' },
  { key: 'weeklyReport',   nameKey: 'notifEmailWeeklyReport' },
];

function renderNotifList() {
  const list = document.getElementById('notifList');
  if (!list || !state.settings) return;
  const notifs = state.settings.notifications;
  if (!notifs.emailTypes) notifs.emailTypes = { dailySummary: true, taskCompleted: false, weeklyReport: false };

  list.innerHTML = NOTIF_ITEMS.map(item => `
    <div class="notif-item" data-notif-wrap="${item.key}">
      <div class="notif-text">
        <div class="notif-name">${t(item.nameKey)}</div>
        <div class="notif-desc">${t(item.descKey)}</div>
      </div>
      <button class="toggle-switch${notifs[item.key] ? ' on' : ''}" data-notif="${item.key}" aria-label="${t(item.nameKey)}" aria-pressed="${notifs[item.key]}"></button>
    </div>
    ${item.hasSubmenu ? `
    <div class="email-subtypes${notifs[item.key] ? '' : ' hidden'}" id="emailSubtypes">
      ${EMAIL_SUBTYPES.map(sub => `
        <label class="email-subtype-row">
          <input type="checkbox" class="email-subtype-cb" data-emailtype="${sub.key}"${notifs.emailTypes[sub.key] ? ' checked' : ''}>
          <span>${t(sub.nameKey)}</span>
        </label>`).join('')}
    </div>` : ''}
  `).join('');

  list.querySelectorAll('.toggle-switch').forEach(btn => {
    btn.addEventListener('click', async () => {
      const key    = btn.dataset.notif;
      const newVal = !state.settings.notifications[key];
      state.settings.notifications[key] = newVal;
      btn.classList.toggle('on', newVal);
      btn.setAttribute('aria-pressed', String(newVal));
      // Show/hide email sub-types
      if (key === 'emailNotifications') {
        const sub = document.getElementById('emailSubtypes');
        if (sub) sub.classList.toggle('hidden', !newVal);
      }
      localStorage.setItem('notif_' + key, String(newVal));
      await apiSaveSettings();
    });
  });

  list.querySelectorAll('.email-subtype-cb').forEach(cb => {
    cb.addEventListener('change', async () => {
      state.settings.notifications.emailTypes[cb.dataset.emailtype] = cb.checked;
      await apiSaveSettings();
    });
  });
}

// ─── On-load notification checks ─────────────────────────────────────────────
function checkDailyDigest() {
  if (!state.settings?.notifications?.dailyDigest) return;
  const today = new Date().toDateString();
  const last  = localStorage.getItem('dailyDigestShown');
  if (last === today) return;
  const hour = new Date().getHours();
  if (hour < 9) return;
  localStorage.setItem('dailyDigestShown', today);
  const open   = state.todos.filter(x => !x.done).length;
  showToast(`📋 ${open} tasks today`);
}

function checkWeeklyReport() {
  if (!state.settings?.notifications?.weeklyReport) return;
  if (state.settings?.notifications?.doNotDisturb) return;
  const day  = new Date().getDay(); // 1 = Monday
  if (day !== 1) return;
  const week = `week_${Math.floor(Date.now() / 604800000)}`;
  if (localStorage.getItem('weeklyReportShown') === week) return;
  localStorage.setItem('weeklyReportShown', week);
  const done = state.todos.filter(x => x.done).length;
  showToast(`📊 ${done} tasks completed this week`);
}

// ─── Boot ─────────────────────────────────────────────────────────────────────
// ─── Android / browser back button ───────────────────────────────────────────
// Push a state on load so there is always something to "pop" back to.
// When the user presses back, we intercept and close drawer/menu instead of
// navigating away (which would land on /login and effectively log them out).
history.replaceState({ app: true }, '');

window.addEventListener('popstate', () => {
  if (state.chartView) {
    closeCharts();
  } else if (state.activeDrawer !== null) {
    closeDrawer();
  } else if (menuOpen) {
    closeMenu();
  }
  // Always re-push so the next back press is also caught.
  history.pushState({ app: true }, '');
});

// ─── Boot ─────────────────────────────────────────────────────────────────────
document.addEventListener('DOMContentLoaded', async () => {

  // ── DB health check ───────────────────────────────────────────────────────
  try {
    const h = await fetch('/api/health').then(r => r.json());
    if (h.database !== 'mongodb') {
      const banner = document.getElementById('dbBanner');
      if (banner) banner.style.display = '';
    }
  } catch (_) {}
  document.getElementById('dbBannerClose')?.addEventListener('click', () => {
    document.getElementById('dbBanner').style.display = 'none';
  });

  // Push initial history entry so popstate fires on first back press
  history.pushState({ app: true }, '');

  // Theme
  const savedTheme = localStorage.getItem('theme');
  if (savedTheme) applyTheme(savedTheme);
  else applyTheme(window.matchMedia('(prefers-color-scheme:dark)').matches ? 'dark' : 'light');

  // Load settings from server
  state.settings = await apiLoadSettings();

  // Language — server setting takes priority over localStorage
  const savedLang = state.settings.language || localStorage.getItem('lang') || 'en';
  applyLanguage(savedLang);

  // Skeleton
  document.getElementById('taskList').innerHTML = skeletonHTML();

  // Load todos
  const raw = await apiLoad();
  state.todos = raw.map(migrateTodo);
  render();

  // Notification checks
  checkDailyDigest();
  checkWeeklyReport();

  // ── Theme button ──────────────────────────────────────────────────────────
  document.getElementById('themeBtn').addEventListener('click', toggleTheme);

  // ── Mic button ────────────────────────────────────────────────────────────
  const micBtn = document.getElementById('micBtn');
  if (micBtn) {
    if (!SpeechRecognition) micBtn.style.display = 'none'; // hide on unsupported browsers
    else micBtn.addEventListener('click', toggleSpeech);
  }

  // ── Add form ──────────────────────────────────────────────────────────────
  document.getElementById('addForm').addEventListener('submit', async e => {
    e.preventDefault();
    const inp = document.getElementById('addInput');
    if (isListening && recognition) recognition.stop();
    await addTodo(inp.value);
    inp.value = '';
    inp.focus();
  });

  // ── Priority picker (inline dropdown, opens on input focus) ──────────────
  document.querySelectorAll('.add-p-btn').forEach(btn => {
    btn.addEventListener('mousedown', e => e.preventDefault()); // prevent blur
    btn.addEventListener('click', () => {
      state.newPriority = btn.dataset.p;
      document.querySelectorAll('.add-p-btn').forEach(b =>
        b.classList.toggle('active', b.dataset.p === btn.dataset.p)
      );
    });
  });

  const addInput = document.getElementById('addInput');
  const addDropdown = document.getElementById('addDropdown');
  addInput.addEventListener('focus', () => addDropdown.classList.add('open'));
  addInput.addEventListener('blur', () => {
    setTimeout(() => {
      if (!document.getElementById('addForm').contains(document.activeElement))
        addDropdown.classList.remove('open');
    }, 180);
  });

  document.addEventListener('click', e => {
    if (!e.target.closest('#addForm'))
      addDropdown.classList.remove('open');
  });

  // ── Filters ───────────────────────────────────────────────────────────────
  document.querySelectorAll('.filter-btn').forEach(b =>
    b.addEventListener('click', () => setFilter(b.dataset.filter))
  );

  // ── Clear done ────────────────────────────────────────────────────────────
  document.getElementById('clearDoneBtn').addEventListener('click', async () => {
    const doneCards = document.querySelectorAll('.task-card.done-card');
    if (!doneCards.length) return;
    doneCards.forEach(card => card.classList.add('removing'));
    await new Promise(r => setTimeout(r, 420));
    state.todos = state.todos.filter(x => !x.done);
    render();
    await apiSave();
  });

  // ── Task list clicks ──────────────────────────────────────────────────────
  document.getElementById('taskList').addEventListener('click', async e => {
    const checkBtn = e.target.closest('[data-check]');
    if (checkBtn) {
      e.stopPropagation();
      await toggleTodo(parseInt(checkBtn.dataset.check), checkBtn);
      return;
    }
    const card = e.target.closest('.task-card');
    if (card) openDrawer(parseInt(card.dataset.id));
  });

  document.getElementById('taskList').addEventListener('keydown', e => {
    if (e.key === 'Enter' || e.key === ' ') {
      const card = e.target.closest('.task-card');
      if (card) { e.preventDefault(); openDrawer(parseInt(card.dataset.id)); }
    }
  });

  // ── Drawer ────────────────────────────────────────────────────────────────
  document.getElementById('overlay').addEventListener('click', e => {
    if (e.target === document.getElementById('overlay')) closeDrawer();
  });

  document.getElementById('drawerClose').addEventListener('click', closeDrawer);
  document.getElementById('drawerTitle').addEventListener('input', scheduleDrawerSave);
  document.getElementById('drawerDesc').addEventListener('input', scheduleDrawerSave);

  // Priority chips
  ['none','low','medium','high'].forEach(p => {
    document.getElementById('dp_' + p).addEventListener('click', async () => {
      const todo = state.todos.find(x => x.id === state.activeDrawer);
      if (!todo) return;
      todo.priority = p;
      renderDrawer(todo);
      render();
      await apiSave();
    });
  });

  document.getElementById('drawerSaveBtn').addEventListener('click', async () => {
    flushDrawerSave();
    render();
    await apiSave();
    closeDrawer();
  });

  document.getElementById('drawerDeleteBtn').addEventListener('click', () => {
    const tl = TL[state.lang] || TL.en;
    confirmAction({
      title: tl.deleteTask || 'Delete Task',
      message: tl.confirmDeleteTask || 'Are you sure you want to delete this task?',
      confirmText: tl.yes || 'Yes',
      onConfirm: async () => {
        const id = state.activeDrawer;
        closeDrawer();
        state.todos = state.todos.filter(x => x.id !== id);
        render();
        await apiSave();
      }
    });
  });

  // Subtask add
  async function addSubtask() {
    const inp  = document.getElementById('subtaskInput');
    const text = inp.value.trim();
    if (!text || state.activeDrawer === null) return;
    const todo = state.todos.find(x => x.id === state.activeDrawer);
    if (!todo) return;
    todo.subtasks.push({ id: Date.now(), text, done: false, createdAt: Date.now(), completedAt: null });
    inp.value = '';
    renderSubtasks(todo);
    render();
    await apiSave();
  }

  document.getElementById('subtaskAddBtn').addEventListener('click', addSubtask);
  document.getElementById('subtaskInput').addEventListener('keydown', e => {
    if (e.key === 'Enter') { e.preventDefault(); addSubtask(); }
  });

  // Subtask mic
  const subMicBtn = document.getElementById('subMicBtn');
  if (subMicBtn) {
    if (!SpeechRecognition) subMicBtn.style.display = 'none';
    else subMicBtn.addEventListener('click', () => {
      if (!recognition) initSpeech();
      // Override onresult to target subtask input
      recognition.onresult = e => {
        const transcript = Array.from(e.results).map(r => r[0].transcript).join('');
        const inp = document.getElementById('subtaskInput');
        if (inp) inp.value = transcript;
      };
      recognition.onend = () => {
        isListening = false;
        updateMicBtn(false);
        updateSubMicBtn(false);
      };
      if (isListening) { recognition.stop(); return; }
      recognition.lang = SPEECH_LOCALE_MAP[state.lang] || 'en-US';
      document.getElementById('subtaskInput').value = '';
      try { recognition.start(); } catch (_) { initSpeech(); recognition.start(); }
      isListening = true;
      updateSubMicBtn(true);
    });
  }

  document.getElementById('subtaskList').addEventListener('click', async e => {
    const todo = state.todos.find(x => x.id === state.activeDrawer);
    if (!todo) return;
    const toggleBtn = e.target.closest('[data-stoggle]');
    if (toggleBtn) {
      const sid = parseFloat(toggleBtn.dataset.stoggle);
      const sub = todo.subtasks.find(s => s.id === sid);
      if (sub) {
        sub.done = !sub.done;
        sub.completedAt = sub.done ? Date.now() : null;
        renderSubtasks(todo); render(); await apiSave();
      }
      return;
    }
    const delBtn = e.target.closest('[data-sdel]');
    if (delBtn) {
      const sid = parseFloat(delBtn.dataset.sdel);
      todo.subtasks = todo.subtasks.filter(s => s.id !== sid);
      renderSubtasks(todo); render(); await apiSave();
    }
  }, true);

  document.getElementById('subtaskList').addEventListener('blur', async e => {
    const el = e.target.closest('[data-sedit]');
    if (!el) return;
    const todo = state.todos.find(x => x.id === state.activeDrawer);
    if (!todo) return;
    const sid = parseFloat(el.dataset.sedit);
    const sub = todo.subtasks.find(s => s.id === sid);
    if (sub) { sub.text = el.textContent.trim() || sub.text; render(); await apiSave(); }
  }, true);

  // ── Profile menu ──────────────────────────────────────────────────────────
  document.getElementById('profileBtn').addEventListener('click', e => {
    e.stopPropagation();
    if (menuOpen) closeMenu(); else openMenu();
  });

  document.addEventListener('click', e => {
    if (menuOpen && !e.target.closest('#profileWrap')) closeMenu();
  });

  // Languages sub-menu
  document.getElementById('menuLangBtn').addEventListener('click', () => {
    renderLangList();
    showMenuPanel('menuLang');
  });
  document.getElementById('langBackBtn').addEventListener('click', () => showMenuPanel('menuMain'));

  // Notifications sub-menu
  document.getElementById('menuNotifBtn').addEventListener('click', () => {
    renderNotifList();
    showMenuPanel('menuNotif');
  });
  document.getElementById('notifBackBtn').addEventListener('click', () => showMenuPanel('menuMain'));

  // ── Escape key ────────────────────────────────────────────────────────────
  document.addEventListener('keydown', e => {
    if (e.key === 'Escape') {
      if (state.activeDrawer !== null) closeDrawer();
      else if (menuOpen) closeMenu();
    }
  });

  // ── Charts ────────────────────────────────────────────────────────────────
  const chartBtn = document.getElementById('chartBtn');
  if (chartBtn) chartBtn.addEventListener('click', openCharts);

  const chartsBackBtn = document.getElementById('chartsBackBtn');
  if (chartsBackBtn) chartsBackBtn.addEventListener('click', closeCharts);

  document.getElementById('chartTabs')?.addEventListener('click', e => {
    const tab = e.target.closest('[data-chart]');
    if (!tab) return;
    state.activeChart = tab.dataset.chart;
    document.querySelectorAll('.chart-tab').forEach(b => b.classList.toggle('active', b.dataset.chart === state.activeChart));
    renderActiveChart();
  });

  document.getElementById('linePeriodRow')?.addEventListener('click', e => {
    const btn = e.target.closest('[data-period]');
    if (!btn) return;
    state.linePeriod = btn.dataset.period;
    document.querySelectorAll('.period-btn').forEach(b => b.classList.toggle('active', b.dataset.period === state.linePeriod));
    renderActiveChart();
  });

  // ── Groups ────────────────────────────────────────────────────────────────
  document.getElementById('groupsBtn').addEventListener('click', showGroupsPage);

  document.getElementById('gbBackBtn').addEventListener('click', showGroupsPage);
  document.getElementById('groupsBackBtn').addEventListener('click', () => {
    state.groupsView = false;
    document.getElementById('groupsPage').style.display = 'none';
    document.getElementById('mainContent').style.display = '';
  });

  document.getElementById('newGroupBtn').addEventListener('click', showCreateGroupModal);

  document.getElementById('gbAddForm').addEventListener('submit', async e => {
    e.preventDefault();
    const input = document.getElementById('gbTaskInput');
    const text = input.value.trim();
    if (!text) return;
    const assignTo = document.getElementById('gbAssignSelect').value || null;
    const priority = document.getElementById('gbPrioritySelect').value || 'low';
    const task = await apiAddGroupTask(state.activeGroup._id, {text, assignedTo: assignTo, priority});
    if (task && task.id) {
      state.activeGroup.tasks.unshift(task);
      input.value = '';
      renderGroupTaskList();
    }
  });

  document.getElementById('gbFilterAll').addEventListener('click', () => { state.groupFilter='all'; renderGroupTaskList(); updateGbFilterBtns(); });
  document.getElementById('gbFilterMine').addEventListener('click', () => { state.groupFilter='mine'; renderGroupTaskList(); updateGbFilterBtns(); });
  document.getElementById('gbFilterUnassigned').addEventListener('click', () => { state.groupFilter='unassigned'; renderGroupTaskList(); updateGbFilterBtns(); });
  document.getElementById('gbSortSelect').addEventListener('change', e => { state.groupSort=e.target.value; renderGroupTaskList(); });

  document.getElementById('gbInviteBtn').addEventListener('click', showInviteModal);
  document.getElementById('gbSettingsBtn').addEventListener('click', showMembersPanel);

  document.getElementById('gbDeleteBtn').addEventListener('click', () => {
    const g = state.activeGroup;
    const tl = TL[state.lang]||TL.en;
    confirmAction({
      title: tl.deleteGroup||'Delete Group',
      message: (tl.confirmDeleteGroup||'Delete "{group}"? All tasks will be lost.').replace('{group}',g.name),
      confirmText: tl.yes||'Yes',
      onConfirm: async () => {
        await apiDeleteGroup(g._id);
        showGroupsPage();
      }
    });
  });

  // ── Notifications bell ────────────────────────────────────────────────────
  document.getElementById('notifBellBtn').addEventListener('click', async e => {
    e.stopPropagation();
    if (document.getElementById('notifDropdown')) {
      document.getElementById('notifDropdown').remove(); return;
    }
    await loadNotifications();
    renderNotifDropdown();
  });

  // ── Logout confirmation ───────────────────────────────────────────────────
  document.querySelector('form[action="/auth/logout"]')?.addEventListener('submit', e => {
    e.preventDefault();
    const tl = TL[state.lang]||TL.en;
    confirmAction({
      title: tl.logout||'Sign Out',
      message: tl.confirmLogout||'Are you sure you want to log out?',
      confirmText: tl.yes||'Yes',
      confirmColor: '#6366F1',
      onConfirm: () => e.target.submit()
    });
  });

  // Load notifications on start and poll
  loadNotifications();
  setInterval(loadNotifications, 30000);

  // Mark body as ready (prevents language flash)
  document.body.classList.add('lang-ready');
});
