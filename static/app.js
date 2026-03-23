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
  gbNewPriority: 'low',
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
    invitationSent:'Invitation sent!',
    invitationSentDesc:'An email has been sent to {email} from noreply@mytasks.bar',
    invitationCreated:'Invitation created',
    invitationShareLink:'Share this link with your friend:',
    copyLink:'Copy Link',copied:'Copied!',done:'Done',
    sending:'Sending...',invitationFailed:'Failed to send invitation. Please try again.',alreadyInvited:'This person has already been invited.',
    sortNewest:'Newest',sortPriority:'Priority',sortAssignee:'Assignee',
    personalTasks:'My Tasks',
    groupTaskNotes:'Notes',groupTaskDetails:'Task Details',
    analytics:'Analytics',teamAnalytics:'Team Analytics',overview:'Overview',
    byMember:'By Member',byPriority:'By Priority',timeAnalysis:'Time Analysis',
    performance:'Performance',estimatedTime:'Estimated',dueDate:'Due date',
    dueIn:'Due in {time}',overdue:'Overdue',overdueBy:'Overdue by {time}',
    completedIn:'Completed in {time}',vsEstimate:'est. {time}',underEstimate:'Under estimate',
    overEstimate:'Over estimate',onTime:'On time',moreOptions:'More options',
    timeAndSchedule:'Time & Schedule',elapsed:'Elapsed',running:'running',
    noEstimate:'No estimate',noDueDate:'No due date',todo:'To Do',inProgress:'In Progress',
    status:'Status',tasksCompleted:'Tasks this week',avgCompletionTime:'Avg time',
    overdueRate:'Overdue rate',onTimeRate:'On-time rate',onTrack:'On Track',
    needsAttention:'Needs Attention',atRisk:'At Risk',
    total:'Total',tasks:'tasks',
    tasksDone:'Tasks Done',tasksInProgress:'In Progress',tasksTodo:'To Do',
    completionRate:'Completion Rate',overdueCount:'Overdue',
    memberWorkload:'Member Workload',
    recentActivity:'Recent Activity',
    actTaskCreated:'created',actTaskCompleted:'completed',actTaskStarted:'started',
    actTaskAssigned:'assigned',actMemberJoined:'joined the group',
    statusBoard:'Status Board',
    dashboard:'Dashboard',groupTasks:'Group Tasks',openDashboard:'Open Dashboard',
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
    invitationSent:'ההזמנה נשלחה!',
    invitationSentDesc:'אימייל נשלח אל {email} מ-noreply@mytasks.bar',
    invitationCreated:'ההזמנה נוצרה',
    invitationShareLink:'שתף את הקישור הזה עם חברך:',
    copyLink:'העתק קישור',copied:'הועתק!',done:'סיום',
    sending:'שולח...',invitationFailed:'שגיאה בשליחת ההזמנה. נסה שוב.',alreadyInvited:'האדם הזה כבר הוזמן.',
    sortNewest:'חדש ביותר',sortPriority:'עדיפות',sortAssignee:'מוקצה',
    personalTasks:'המשימות שלי',groupTaskNotes:'הערות',groupTaskDetails:'פרטי המשימה',
    analytics:'ניתוח',teamAnalytics:'ניתוח צוות',overview:'סקירה',
    byMember:'לפי חבר',byPriority:'לפי עדיפות',timeAnalysis:'ניתוח זמן',
    performance:'ביצועים',estimatedTime:'הערכה',dueDate:'תאריך יעד',
    dueIn:'יעד בעוד {time}',overdue:'באיחור',overdueBy:'באיחור של {time}',
    completedIn:'הושלם תוך {time}',vsEstimate:'הערכה {time}',underEstimate:'מתחת להערכה',
    overEstimate:'מעל להערכה',onTime:'בזמן',moreOptions:'אפשרויות נוספות',
    timeAndSchedule:'זמן ולוח זמנים',elapsed:'חלף',running:'פועל',
    noEstimate:'ללא הערכה',noDueDate:'ללא תאריך יעד',todo:'לביצוע',inProgress:'בתהליך',
    status:'סטטוס',tasksCompleted:'משימות השבוע',avgCompletionTime:'זמן ממוצע',
    overdueRate:'שיעור איחור',onTimeRate:'שיעור בזמן',onTrack:'במסלול',
    needsAttention:'דורש תשומת לב',atRisk:'בסיכון',
    total:'סה"כ',tasks:'משימות',
    tasksDone:'משימות שהושלמו',tasksInProgress:'בביצוע',tasksTodo:'לביצוע',
    completionRate:'אחוז השלמה',overdueCount:'באיחור',
    memberWorkload:'עומס עבודה לפי חבר',
    recentActivity:'פעילות אחרונה',
    actTaskCreated:'יצר',actTaskCompleted:'השלים',actTaskStarted:'התחיל',
    actTaskAssigned:'הקצה',actMemberJoined:'הצטרף לקבוצה',
    statusBoard:'לוח סטטוס',
    dashboard:'לוח בקרה',groupTasks:'משימות קבוצה',openDashboard:'פתח לוח בקרה',
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
    invitationSent:'تم إرسال الدعوة!',
    invitationSentDesc:'تم إرسال بريد إلكتروني إلى {email} من noreply@mytasks.bar',
    invitationCreated:'تم إنشاء الدعوة',
    invitationShareLink:'شارك هذا الرابط مع صديقك:',
    copyLink:'نسخ الرابط',copied:'تم النسخ!',done:'تم',
    sending:'جارٍ الإرسال...',invitationFailed:'فشل إرسال الدعوة. يرجى المحاولة مرة أخرى.',alreadyInvited:'تمت دعوة هذا الشخص بالفعل.',
    sortNewest:'الأحدث',sortPriority:'الأولوية',sortAssignee:'المعين',
    personalTasks:'مهامي',groupTaskNotes:'ملاحظات',groupTaskDetails:'تفاصيل المهمة',
    analytics:'تحليلات',teamAnalytics:'تحليلات الفريق',overview:'نظرة عامة',
    byMember:'حسب العضو',byPriority:'حسب الأولوية',timeAnalysis:'تحليل الوقت',
    performance:'الأداء',estimatedTime:'التقدير',dueDate:'تاريخ الاستحقاق',
    dueIn:'يستحق في {time}',overdue:'متأخر',overdueBy:'متأخر بـ {time}',
    completedIn:'أُنجز في {time}',vsEstimate:'تقدير {time}',underEstimate:'أقل من التقدير',
    overEstimate:'أكثر من التقدير',onTime:'في الوقت',moreOptions:'خيارات أخرى',
    timeAndSchedule:'الوقت والجدول',elapsed:'مضى',running:'يعمل',
    noEstimate:'بدون تقدير',noDueDate:'بدون موعد',todo:'للتنفيذ',inProgress:'قيد التنفيذ',
    status:'الحالة',tasksCompleted:'مهام هذا الأسبوع',avgCompletionTime:'متوسط الوقت',
    overdueRate:'معدل التأخر',onTimeRate:'معدل الالتزام',onTrack:'على المسار',
    needsAttention:'يحتاج انتباه',atRisk:'في خطر',
    total:'المجموع',tasks:'مهام',
    tasksDone:'المهام المنجزة',tasksInProgress:'قيد التنفيذ',tasksTodo:'للتنفيذ',
    completionRate:'معدل الإنجاز',overdueCount:'متأخرة',
    memberWorkload:'حمل عمل العضو',
    recentActivity:'النشاط الأخير',
    actTaskCreated:'أنشأ',actTaskCompleted:'أكمل',actTaskStarted:'بدأ',
    actTaskAssigned:'كلف',actMemberJoined:'انضم إلى المجموعة',
    statusBoard:'لوحة الحالة',
    dashboard:'لوحة التحكم',groupTasks:'مهام المجموعة',openDashboard:'فتح لوحة التحكم',
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
    invitationSent:'¡Invitación enviada!',
    invitationSentDesc:'Se ha enviado un correo a {email} desde noreply@mytasks.bar',
    invitationCreated:'Invitación creada',
    invitationShareLink:'Comparte este enlace con tu amigo:',
    copyLink:'Copiar enlace',copied:'¡Copiado!',done:'Listo',
    sending:'Enviando...',invitationFailed:'Error al enviar la invitación. Inténtalo de nuevo.',alreadyInvited:'Esta persona ya ha sido invitada.',
    sortNewest:'Más reciente',sortPriority:'Prioridad',sortAssignee:'Asignado',
    personalTasks:'Mis Tareas',groupTaskNotes:'Notas',groupTaskDetails:'Detalles de tarea',
    analytics:'Análisis',teamAnalytics:'Análisis de equipo',overview:'Resumen',
    byMember:'Por miembro',byPriority:'Por prioridad',timeAnalysis:'Análisis de tiempo',
    performance:'Rendimiento',estimatedTime:'Estimado',dueDate:'Fecha límite',
    dueIn:'Vence en {time}',overdue:'Vencido',overdueBy:'Vencido por {time}',
    completedIn:'Completado en {time}',vsEstimate:'est. {time}',underEstimate:'Por debajo',
    overEstimate:'Por encima',onTime:'A tiempo',moreOptions:'Más opciones',
    timeAndSchedule:'Tiempo y agenda',elapsed:'Transcurrido',running:'en curso',
    noEstimate:'Sin estimación',noDueDate:'Sin fecha',todo:'Pendiente',inProgress:'En progreso',
    status:'Estado',tasksCompleted:'Tareas esta semana',avgCompletionTime:'Tiempo medio',
    overdueRate:'Tasa de retraso',onTimeRate:'Tasa a tiempo',onTrack:'En camino',
    needsAttention:'Necesita atención',atRisk:'En riesgo',
    total:'Total',tasks:'tareas',
    tasksDone:'Tareas completadas',tasksInProgress:'En progreso',tasksTodo:'Por hacer',
    completionRate:'Tasa de finalización',overdueCount:'Atrasadas',
    memberWorkload:'Carga de trabajo',
    recentActivity:'Actividad reciente',
    actTaskCreated:'creó',actTaskCompleted:'completó',actTaskStarted:'comenzó',
    actTaskAssigned:'asignó',actMemberJoined:'se unió al grupo',
    statusBoard:'Tablero de estado',
    dashboard:'Panel',groupTasks:'Tareas de grupo',openDashboard:'Abrir panel',
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
    invitationSent:'Invitation envoyée !',
    invitationSentDesc:'Un email a été envoyé à {email} depuis noreply@mytasks.bar',
    invitationCreated:'Invitation créée',
    invitationShareLink:'Partagez ce lien avec votre ami :',
    copyLink:'Copier le lien',copied:'Copié !',done:'Terminé',
    sending:'Envoi...',invitationFailed:'Échec de l\'envoi. Veuillez réessayer.',alreadyInvited:'Cette personne a déjà été invitée.',
    sortNewest:'Plus récent',sortPriority:'Priorité',sortAssignee:'Assigné',
    personalTasks:'Mes Tâches',groupTaskNotes:'Notes',groupTaskDetails:'Détails de la tâche',
    analytics:'Analyses',teamAnalytics:'Analyses équipe',overview:'Vue d\'ensemble',
    byMember:'Par membre',byPriority:'Par priorité',timeAnalysis:'Analyse temps',
    performance:'Performance',estimatedTime:'Estimé',dueDate:'Échéance',
    dueIn:'Échéance dans {time}',overdue:'En retard',overdueBy:'En retard de {time}',
    completedIn:'Terminé en {time}',vsEstimate:'est. {time}',underEstimate:'Sous l\'estimation',
    overEstimate:'Au-delà',onTime:'À temps',moreOptions:'Plus d\'options',
    timeAndSchedule:'Temps & Agenda',elapsed:'Écoulé',running:'en cours',
    noEstimate:'Sans estimation',noDueDate:'Sans échéance',todo:'À faire',inProgress:'En cours',
    status:'Statut',tasksCompleted:'Tâches cette semaine',avgCompletionTime:'Temps moyen',
    overdueRate:'Taux de retard',onTimeRate:'Taux à temps',onTrack:'Dans les délais',
    needsAttention:'Attention requise',atRisk:'À risque',
    total:'Total',tasks:'tâches',
    tasksDone:'Tâches terminées',tasksInProgress:'En cours',tasksTodo:'À faire',
    completionRate:'Taux d\'achèvement',overdueCount:'En retard',
    memberWorkload:'Charge de travail',
    recentActivity:'Activité récente',
    actTaskCreated:'a créé',actTaskCompleted:'a terminé',actTaskStarted:'a commencé',
    actTaskAssigned:'a assigné',actMemberJoined:'a rejoint le groupe',
    statusBoard:'Tableau de statut',
    dashboard:'Tableau de bord',groupTasks:'Tâches de groupe',openDashboard:'Ouvrir le tableau de bord',
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
    invitationSent:'Einladung gesendet!',
    invitationSentDesc:'Eine E-Mail wurde an {email} von noreply@mytasks.bar gesendet',
    invitationCreated:'Einladung erstellt',
    invitationShareLink:'Teilen Sie diesen Link mit Ihrem Freund:',
    copyLink:'Link kopieren',copied:'Kopiert!',done:'Fertig',
    sending:'Senden...',invitationFailed:'Einladung fehlgeschlagen. Bitte erneut versuchen.',alreadyInvited:'Diese Person wurde bereits eingeladen.',
    sortNewest:'Neueste',sortPriority:'Priorität',sortAssignee:'Zugewiesen',
    personalTasks:'Meine Aufgaben',groupTaskNotes:'Notizen',groupTaskDetails:'Aufgabendetails',
    analytics:'Analysen',teamAnalytics:'Team-Analysen',overview:'Übersicht',
    byMember:'Nach Mitglied',byPriority:'Nach Priorität',timeAnalysis:'Zeitanalyse',
    performance:'Leistung',estimatedTime:'Schätzung',dueDate:'Fälligkeitsdatum',
    dueIn:'Fällig in {time}',overdue:'Überfällig',overdueBy:'Überfällig um {time}',
    completedIn:'Abgeschlossen in {time}',vsEstimate:'gesch. {time}',underEstimate:'Unter Schätzung',
    overEstimate:'Über Schätzung',onTime:'Pünktlich',moreOptions:'Weitere Optionen',
    timeAndSchedule:'Zeit & Zeitplan',elapsed:'Verstrichen',running:'läuft',
    noEstimate:'Keine Schätzung',noDueDate:'Kein Datum',todo:'Zu erledigen',inProgress:'In Arbeit',
    status:'Status',tasksCompleted:'Aufgaben diese Woche',avgCompletionTime:'Durchschn. Zeit',
    overdueRate:'Überfälligkeitsrate',onTimeRate:'Pünktlichkeitsrate',onTrack:'Im Plan',
    needsAttention:'Aufmerksamkeit nötig',atRisk:'Gefährdet',
    total:'Gesamt',tasks:'Aufgaben',
    tasksDone:'Erledigte Aufgaben',tasksInProgress:'In Bearbeitung',tasksTodo:'Zu erledigen',
    completionRate:'Abschlussrate',overdueCount:'Überfällig',
    memberWorkload:'Arbeitsbelastung',
    recentActivity:'Letzte Aktivität',
    actTaskCreated:'erstellt',actTaskCompleted:'abgeschlossen',actTaskStarted:'begonnen',
    actTaskAssigned:'zugewiesen',actMemberJoined:'ist beigetreten',
    statusBoard:'Statusboard',
    dashboard:'Dashboard',groupTasks:'Gruppenaufgaben',openDashboard:'Dashboard öffnen',
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
    invitationSent:'Приглашение отправлено!',
    invitationSentDesc:'Письмо отправлено на {email} с noreply@mytasks.bar',
    invitationCreated:'Приглашение создано',
    invitationShareLink:'Поделитесь этой ссылкой с другом:',
    copyLink:'Скопировать ссылку',copied:'Скопировано!',done:'Готово',
    sending:'Отправка...',invitationFailed:'Не удалось отправить приглашение. Попробуйте ещё раз.',alreadyInvited:'Этот человек уже приглашён.',
    sortNewest:'Новейшие',sortPriority:'Приоритет',sortAssignee:'Исполнитель',
    personalTasks:'Мои задачи',groupTaskNotes:'Заметки',groupTaskDetails:'Детали задачи',
    analytics:'Аналитика',teamAnalytics:'Аналитика команды',overview:'Обзор',
    byMember:'По участнику',byPriority:'По приоритету',timeAnalysis:'Анализ времени',
    performance:'Производительность',estimatedTime:'Оценка',dueDate:'Срок выполнения',
    dueIn:'Срок через {time}',overdue:'Просрочено',overdueBy:'Просрочено на {time}',
    completedIn:'Выполнено за {time}',vsEstimate:'оценка {time}',underEstimate:'Ниже оценки',
    overEstimate:'Выше оценки',onTime:'Вовремя',moreOptions:'Дополнительно',
    timeAndSchedule:'Время и расписание',elapsed:'Прошло',running:'выполняется',
    noEstimate:'Без оценки',noDueDate:'Без срока',todo:'К выполнению',inProgress:'В процессе',
    status:'Статус',tasksCompleted:'Задачи за неделю',avgCompletionTime:'Среднее время',
    overdueRate:'Просроченность',onTimeRate:'Своевременность',onTrack:'В срок',
    needsAttention:'Требует внимания',atRisk:'Под угрозой',
    total:'Всего',tasks:'задач',
    tasksDone:'Выполненные задачи',tasksInProgress:'В процессе',tasksTodo:'К выполнению',
    completionRate:'Процент выполнения',overdueCount:'Просроченные',
    memberWorkload:'Нагрузка участника',
    recentActivity:'Недавняя активность',
    actTaskCreated:'создал',actTaskCompleted:'завершил',actTaskStarted:'начал',
    actTaskAssigned:'назначил',actMemberJoined:'присоединился к группе',
    statusBoard:'Доска статусов',
    dashboard:'Панель управления',groupTasks:'Групповые задачи',openDashboard:'Открыть панель',
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
    invitationSent:'Convite enviado!',
    invitationSentDesc:'Um email foi enviado para {email} de noreply@mytasks.bar',
    invitationCreated:'Convite criado',
    invitationShareLink:'Compartilhe este link com seu amigo:',
    copyLink:'Copiar link',copied:'Copiado!',done:'Pronto',
    sending:'Enviando...',invitationFailed:'Falha ao enviar convite. Tente novamente.',alreadyInvited:'Esta pessoa já foi convidada.',
    sortNewest:'Mais recente',sortPriority:'Prioridade',sortAssignee:'Responsável',
    personalTasks:'Minhas Tarefas',groupTaskNotes:'Notas',groupTaskDetails:'Detalhes da tarefa',
    analytics:'Análises',teamAnalytics:'Análises da equipe',overview:'Visão geral',
    byMember:'Por membro',byPriority:'Por prioridade',timeAnalysis:'Análise de tempo',
    performance:'Desempenho',estimatedTime:'Estimado',dueDate:'Prazo',
    dueIn:'Vence em {time}',overdue:'Atrasado',overdueBy:'Atrasado em {time}',
    completedIn:'Concluído em {time}',vsEstimate:'est. {time}',underEstimate:'Abaixo do estimado',
    overEstimate:'Acima do estimado',onTime:'No prazo',moreOptions:'Mais opções',
    timeAndSchedule:'Tempo e agenda',elapsed:'Decorrido',running:'em andamento',
    noEstimate:'Sem estimativa',noDueDate:'Sem prazo',todo:'A fazer',inProgress:'Em andamento',
    status:'Status',tasksCompleted:'Tarefas esta semana',avgCompletionTime:'Tempo médio',
    overdueRate:'Taxa de atraso',onTimeRate:'Taxa no prazo',onTrack:'No caminho',
    needsAttention:'Precisa atenção',atRisk:'Em risco',
    total:'Total',tasks:'tarefas',
    tasksDone:'Tarefas concluídas',tasksInProgress:'Em andamento',tasksTodo:'A fazer',
    completionRate:'Taxa de conclusão',overdueCount:'Atrasadas',
    memberWorkload:'Carga de trabalho',
    recentActivity:'Atividade recente',
    actTaskCreated:'criou',actTaskCompleted:'concluiu',actTaskStarted:'iniciou',
    actTaskAssigned:'atribuiu',actMemberJoined:'entrou no grupo',
    statusBoard:'Quadro de status',
    dashboard:'Painel',groupTasks:'Tarefas do grupo',openDashboard:'Abrir painel',
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
    invitationSent:'邀请已发送！',
    invitationSentDesc:'邮件已从 noreply@mytasks.bar 发送至 {email}',
    invitationCreated:'邀请已创建',
    invitationShareLink:'将此链接分享给您的朋友：',
    copyLink:'复制链接',copied:'已复制！',done:'完成',
    sending:'发送中...',invitationFailed:'发送邀请失败，请重试。',alreadyInvited:'此人已被邀请。',
    sortNewest:'最新',sortPriority:'优先级',sortAssignee:'负责人',
    personalTasks:'我的任务',groupTaskNotes:'备注',groupTaskDetails:'任务详情',
    analytics:'统计',teamAnalytics:'团队统计',overview:'概览',
    byMember:'按成员',byPriority:'按优先级',timeAnalysis:'时间分析',
    performance:'绩效',estimatedTime:'预估',dueDate:'截止日期',
    dueIn:'还剩{time}',overdue:'已逾期',overdueBy:'逾期{time}',
    completedIn:'用时{time}',vsEstimate:'估计{time}',underEstimate:'低于预估',
    overEstimate:'超出预估',onTime:'准时',moreOptions:'更多选项',
    timeAndSchedule:'时间与计划',elapsed:'已用时',running:'进行中',
    noEstimate:'无预估',noDueDate:'无截止日期',todo:'待办',inProgress:'进行中',
    status:'状态',tasksCompleted:'本周任务',avgCompletionTime:'平均时间',
    overdueRate:'逾期率',onTimeRate:'准时率',onTrack:'按计划',
    needsAttention:'需要关注',atRisk:'有风险',
    total:'总计',tasks:'任务',
    tasksDone:'已完成任务',tasksInProgress:'进行中',tasksTodo:'待办',
    completionRate:'完成率',overdueCount:'逾期',
    memberWorkload:'成员工作量',
    recentActivity:'最近活动',
    actTaskCreated:'创建了',actTaskCompleted:'完成了',actTaskStarted:'开始了',
    actTaskAssigned:'分配了',actMemberJoined:'加入了群组',
    statusBoard:'状态看板',
    dashboard:'仪表板',groupTasks:'团队任务',openDashboard:'打开仪表板',
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
    invitationSent:'招待を送信しました！',
    invitationSentDesc:'{email} に noreply@mytasks.bar からメールを送りました',
    invitationCreated:'招待を作成しました',
    invitationShareLink:'このリンクを友達に共有してください：',
    copyLink:'リンクをコピー',copied:'コピーしました！',done:'完了',
    sending:'送信中...',invitationFailed:'招待の送信に失敗しました。もう一度お試しください。',alreadyInvited:'このユーザーはすでに招待されています。',
    sortNewest:'新しい順',sortPriority:'優先度',sortAssignee:'担当者',
    personalTasks:'マイタスク',groupTaskNotes:'メモ',groupTaskDetails:'タスク詳細',
    analytics:'分析',teamAnalytics:'チーム分析',overview:'概要',
    byMember:'メンバー別',byPriority:'優先度別',timeAnalysis:'時間分析',
    performance:'パフォーマンス',estimatedTime:'見積もり',dueDate:'期限',
    dueIn:'{time}後に期限',overdue:'期限切れ',overdueBy:'{time}遅延',
    completedIn:'{time}で完了',vsEstimate:'見積: {time}',underEstimate:'見積以下',
    overEstimate:'見積超過',onTime:'時間通り',moreOptions:'詳細オプション',
    timeAndSchedule:'時間とスケジュール',elapsed:'経過',running:'実行中',
    noEstimate:'見積なし',noDueDate:'期限なし',todo:'未着手',inProgress:'進行中',
    status:'ステータス',tasksCompleted:'今週のタスク',avgCompletionTime:'平均時間',
    overdueRate:'遅延率',onTimeRate:'時間遵守率',onTrack:'順調',
    needsAttention:'要注意',atRisk:'リスクあり',
    total:'合計',tasks:'タスク',
    tasksDone:'完了タスク',tasksInProgress:'進行中',tasksTodo:'未着手',
    completionRate:'完了率',overdueCount:'期限超過',
    memberWorkload:'メンバー作業量',
    recentActivity:'最近のアクティビティ',
    actTaskCreated:'を作成しました',actTaskCompleted:'を完了しました',actTaskStarted:'を開始しました',
    actTaskAssigned:'に割り当てました',actMemberJoined:'グループに参加しました',
    statusBoard:'ステータスボード',
    dashboard:'ダッシュボード',groupTasks:'グループタスク',openDashboard:'ダッシュボードを開く',
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

// ─── Task status helper ───────────────────────────────────────────────────────
function getTaskStatus(task) {
  if (task.status) return task.status;
  return task.done ? 'done' : 'todo';
}

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
  if (typeof updatePageTitle === 'function') { updatePageTitle(); return; }
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
function showGroupsPage() {
  navigateTo('/groups');
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
    return `<div class="group-card" data-gid="${g._id}" data-slug="${g.slug||g._id}" style="--g-color:${g.color}">
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
    card.addEventListener('click', () => navigateTo(`/groups/${card.dataset.slug}`));
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
    if (result.slug) {
      navigateTo(`/groups/${result.slug}`);
    } else if (result._id) {
      navigateTo(`/groups/${result._id}`);
    }
  };
  el.addEventListener('click', e => { if (e.target === el) close(); });
}

// ─── Group board ──────────────────────────────────────────────────────────────
function openGroupBoard(groupId, slug) {
  if (slug) {
    navigateTo(`/groups/${slug}`);
  } else {
    // Fallback: use group ID (router will handle by-slug lookup)
    navigateTo(`/groups/${groupId}`);
  }
}

function renderGroupBoard() {
  const g = state.activeGroup;
  const tl = TL[state.lang] || TL.en;
  const myRole = g.myRole;
  const userId = window.__USER__?.id;

  // Ensure URL shows the slug-based path (canonical URL)
  if (g.slug) {
    const expectedPath = `/groups/${g.slug}`;
    if (!window.location.pathname.startsWith(expectedPath)) {
      history.replaceState({ path: expectedPath }, '', expectedPath);
    }
  }

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

  // Update input placeholder and priority pill labels with current language
  const gbInput = document.getElementById('gbTaskInput');
  if (gbInput) gbInput.placeholder = tl.addTaskPlaceholder || 'What needs to be done?';
  document.querySelectorAll('[data-gbp]').forEach(btn => {
    const p = btn.dataset.gbp;
    if (p === 'low') btn.textContent = tl.priorityLow || 'Low';
    else if (p === 'medium') btn.textContent = tl.priorityMedium || 'Medium';
    else if (p === 'high') btn.textContent = tl.priorityHigh || 'High';
  });
  const gbAddSubmit = document.getElementById('gbAddSubmit');
  if (gbAddSubmit) gbAddSubmit.textContent = tl.add || 'Add';

  // Update filter/sort buttons
  document.getElementById('gbFilterAll').textContent = tl.allTasks || 'All';
  document.getElementById('gbFilterMine').textContent = tl.myTasksFilter || 'Mine';
  document.getElementById('gbFilterUnassigned').textContent = tl.filterUnassigned || 'Unassigned';
  const gbSortSelect = document.getElementById('gbSortSelect');
  if (gbSortSelect) {
    gbSortSelect.options[0].text = tl.sortNewest || 'Newest';
    gbSortSelect.options[1].text = tl.sortPriority || 'Priority';
    gbSortSelect.options[2].text = tl.sortAssignee || 'Assignee';
  }

  updateGbFilterBtns();
  renderGroupTaskList();
  // Re-render group analytics if open
  if (typeof renderGbAnalytics === 'function') {
    setTimeout(renderGbAnalytics, 0);
  }
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
    const subs = task.subtasks || [];
    const subsDone = subs.filter(s=>s.done).length;
    const subBar = subs.length ? `<span class="gt-sub-count">${subsDone}/${subs.length}</span>` : '';
    const taskStatus = getTaskStatus(task);
    const isDone = taskStatus === 'done';
    const isInProg = taskStatus === 'in_progress';
    const cbClass = isDone ? ' ticked' : isInProg ? ' in-progress' : '';
    const rowClass = isDone ? ' gt-done' : isInProg ? ' in-progress-card' : '';
    return `<div class="group-task-row${rowClass}" data-tid="${task.id}" style="cursor:pointer">
      <button class="task-cb${cbClass}" data-gtcheck="${task.id}" aria-label="Cycle status">
        ${isDone?`<svg width="12" height="12" viewBox="0 0 24 24" fill="none" stroke="white" stroke-width="3" stroke-linecap="round"><polyline points="20 6 9 12 4 10"/></svg>`:''}
      </button>
      <span class="gt-title">${esc(task.text)}${subBar}</span>
      <span class="gt-assignee">
        ${assignee ? (assignee.picture ? `<img class="gm-avatar sm" src="${assignee.picture}">` : `<div class="gm-avatar gm-avatar-fb sm">${(assignee.name||'?')[0]}</div>`) + `<span>${assignee.name}</span>` : `<span class="gt-unassigned">${tl.unassigned||'Unassigned'}</span>`}
      </span>
      <span class="gt-priority" style="background:${pColors[task.priority]||pColors.none}"></span>
      ${canDelete ? `<button class="gt-del" data-gtdel="${task.id}" aria-label="Delete">✕</button>` : ''}
    </div>`;
  }).join('') : `<div class="empty"><div class="empty-icon">✅</div><div class="empty-title">${tl.noTasks||'No tasks yet'}</div></div>`;

  document.getElementById('gbTaskList').querySelectorAll('[data-gtcheck]').forEach(btn => {
    btn.addEventListener('click', async e => {
      e.stopPropagation();
      const task = g.tasks.find(tk => tk.id === btn.dataset.gtcheck);
      if (!task) return;
      if (myRole === 'member' && task.assignedTo !== userId) return;
      const currentStatus = getTaskStatus(task);
      let nextStatus;
      if (currentStatus === 'todo') {
        nextStatus = 'in_progress';
      } else if (currentStatus === 'in_progress') {
        nextStatus = 'done';
      } else {
        nextStatus = 'todo';
      }
      task.status = nextStatus;
      if (nextStatus === 'done') {
        task.done = true;
        task.completedAt = Date.now();
      } else if (nextStatus === 'in_progress') {
        task.done = false;
        task.completedAt = null;
        if (!task.startedAt) task.startedAt = Date.now();
      } else {
        task.done = false;
        task.completedAt = null;
        task.startedAt = null;
      }
      renderGroupTaskList();
      await apiUpdateGroupTask(g._id, task.id, {status: nextStatus, done: task.done, startedAt: task.startedAt || null, completedAt: task.completedAt || null});
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

  // Click on task row opens detail modal
  document.getElementById('gbTaskList').querySelectorAll('.group-task-row').forEach(row => {
    row.addEventListener('click', e => {
      if (e.target.closest('[data-gtcheck]') || e.target.closest('[data-gtdel]')) return;
      const task = g.tasks.find(tk => tk.id === row.dataset.tid);
      if (task) showGroupTaskDetail(task);
    });
  });
}

function updateGbFilterBtns() {
  ['All','Mine','Unassigned'].forEach(f => {
    document.getElementById('gbFilter'+f)?.classList.toggle('active', state.groupFilter===f.toLowerCase());
  });
}

// ─── Group task detail modal (with subtasks, notes, priority) ─────────────────
function showGroupTaskDetail(task) {
  const g = state.activeGroup;
  const tl = TL[state.lang] || TL.en;
  const myRole = g.myRole;
  const userId = window.__USER__?.id;
  const canEdit = myRole==='admin'||myRole==='manager'||task.createdBy===userId||task.assignedTo===userId;
  const members = g.members.filter(m=>m.status==='active');
  document.getElementById('gtDetailModal')?.remove();

  function renderSubtasks() {
    const subs = task.subtasks || [];
    return subs.map((s,i) => `
      <div class="subtask-item">
        <button class="subtask-cb${s.done?' st-done':''}" data-gtsub="${i}" aria-label="Toggle">
          ${s.done?`<svg width="10" height="10" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="3" stroke-linecap="round"><polyline points="20 6 9 12 4 10"/></svg>`:''}
        </button>
        <span class="subtask-text${s.done?' st-done-text':''}">${esc(s.text)}</span>
        <button class="subtask-del-btn" data-gtsubdel="${i}" aria-label="Delete">✕</button>
      </div>`).join('');
  }

  const el = document.createElement('div');
  el.id = 'gtDetailModal';
  el.className = 'confirm-overlay open';
  el.innerHTML = `
    <div class="confirm-card modal-wide" style="max-height:85vh;overflow-y:auto">
      <div class="confirm-title" style="margin-bottom:12px">${tl.groupTaskDetails||'Task Details'}</div>
      <textarea class="modal-input" id="gtdTitle" rows="2" style="resize:none;font-weight:600"${!canEdit?' readonly':''}>${esc(task.text)}</textarea>
      <textarea class="modal-input" id="gtdNotes" rows="3" placeholder="${tl.groupTaskNotes||'Notes…'}"${!canEdit?' readonly':''}>${esc(task.description||'')}</textarea>
      <div style="margin:8px 0">
        <label style="font-size:12px;color:var(--text-secondary);display:block;margin-bottom:6px">${tl.priority||'Priority'}</label>
        <div class="add-p-row" id="gtdPriority">
          <button class="add-p-btn${task.priority==='low'?' active':''}" data-gtdp="low" type="button">${tl.priorityLow||'Low'}</button>
          <button class="add-p-btn${task.priority==='medium'?' active':''}" data-gtdp="medium" type="button">${tl.priorityMedium||'Medium'}</button>
          <button class="add-p-btn${task.priority==='high'?' active':''}" data-gtdp="high" type="button">${tl.priorityHigh||'High'}</button>
        </div>
      </div>
      <div style="margin:8px 0">
        <label style="font-size:12px;color:var(--text-secondary);display:block;margin-bottom:6px">${tl.assignedTo||'Assigned to'}</label>
        <select class="gb-select" id="gtdAssign" style="width:100%"${myRole==='member'?' disabled':''}>
          <option value="">${tl.unassigned||'Unassigned'}</option>
          ${members.map(m=>`<option value="${m.userId}"${m.userId===task.assignedTo?' selected':''}>${m.name}</option>`).join('')}
        </select>
      </div>
      <div style="margin:12px 0 6px">
        <div class="subtask-header">
          <label style="font-size:12px;color:var(--text-secondary)">${tl.subtasks||'Sub-tasks'}</label>
        </div>
        <div class="subtask-list" id="gtdSubList">${renderSubtasks()}</div>
        <div class="subtask-add-row" style="margin-top:8px">
          <input class="subtask-add-input" id="gtdSubInput" type="text" placeholder="${tl.addSubtask||'Add a sub-task…'}">
          <button class="mic-btn" id="gtdSubMic" type="button" aria-label="Voice input">
            <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round">
              <path d="M12 1a3 3 0 0 0-3 3v8a3 3 0 0 0 6 0V4a3 3 0 0 0-3-3z"/>
              <path d="M19 10v2a7 7 0 0 1-14 0v-2"/>
              <line x1="12" y1="19" x2="12" y2="23"/><line x1="8" y1="23" x2="16" y2="23"/>
            </svg>
          </button>
          <button class="subtask-add-btn" id="gtdSubAddBtn" type="button">+</button>
        </div>
      </div>
      <div class="confirm-actions">
        <button class="confirm-cancel" id="gtdCancel">${tl.cancel||'Cancel'}</button>
        <button class="confirm-ok" id="gtdSave">${tl.save||'Save'}</button>
      </div>
    </div>`;
  document.body.appendChild(el);

  let localPriority = task.priority || 'low';
  let localSubtasks = JSON.parse(JSON.stringify(task.subtasks || []));

  function refreshSubList() {
    el.querySelector('#gtdSubList').innerHTML = renderSubtasksLocal();
    wireSubEvents();
  }

  function renderSubtasksLocal() {
    return localSubtasks.map((s,i) => `
      <div class="subtask-item">
        <button class="subtask-cb${s.done?' st-done':''}" data-gtsub="${i}" aria-label="Toggle">
          ${s.done?`<svg width="10" height="10" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="3" stroke-linecap="round"><polyline points="20 6 9 12 4 10"/></svg>`:''}
        </button>
        <span class="subtask-text${s.done?' st-done-text':''}">${esc(s.text)}</span>
        <button class="subtask-del-btn" data-gtsubdel="${i}" aria-label="Delete">✕</button>
      </div>`).join('');
  }

  function wireSubEvents() {
    el.querySelectorAll('[data-gtsub]').forEach(btn => {
      btn.addEventListener('click', () => {
        const i = parseInt(btn.dataset.gtsub);
        localSubtasks[i].done = !localSubtasks[i].done;
        refreshSubList();
      });
    });
    el.querySelectorAll('[data-gtsubdel]').forEach(btn => {
      btn.addEventListener('click', () => {
        localSubtasks.splice(parseInt(btn.dataset.gtsubdel), 1);
        refreshSubList();
      });
    });
  }

  wireSubEvents();

  // Priority pills
  el.querySelectorAll('[data-gtdp]').forEach(btn => {
    btn.addEventListener('click', () => {
      if (!canEdit) return;
      localPriority = btn.dataset.gtdp;
      el.querySelectorAll('[data-gtdp]').forEach(b => b.classList.toggle('active', b.dataset.gtdp === localPriority));
    });
  });

  // Add subtask
  function addSubLocal() {
    const inp = el.querySelector('#gtdSubInput');
    const text = inp.value.trim();
    if (!text) return;
    localSubtasks.push({text, done: false});
    inp.value = '';
    refreshSubList();
  }
  el.querySelector('#gtdSubAddBtn').addEventListener('click', addSubLocal);
  el.querySelector('#gtdSubInput').addEventListener('keydown', e2 => { if (e2.key === 'Enter') { e2.preventDefault(); addSubLocal(); } });

  // Subtask mic
  const gtdSubMic = el.querySelector('#gtdSubMic');
  if (SpeechRecognition && gtdSubMic) {
    gtdSubMic.addEventListener('click', () => {
      if (!recognition) initSpeech();
      recognition.onresult = e2 => {
        el.querySelector('#gtdSubInput').value = Array.from(e2.results).map(r=>r[0].transcript).join('');
      };
      recognition.onend = () => { isListening = false; gtdSubMic.classList.remove('mic-active'); };
      if (isListening) { recognition.stop(); return; }
      recognition.lang = SPEECH_LOCALE_MAP[state.lang] || 'en-US';
      try { recognition.start(); } catch(_) { initSpeech(); recognition.start(); }
      isListening = true; gtdSubMic.classList.add('mic-active');
    });
  } else if (gtdSubMic) {
    gtdSubMic.style.display = 'none';
  }

  const close = () => { el.classList.remove('open'); setTimeout(() => el.remove(), 200); };
  el.querySelector('#gtdCancel').addEventListener('click', close);

  el.querySelector('#gtdSave').addEventListener('click', async () => {
    if (!canEdit) { close(); return; }
    const newText = el.querySelector('#gtdTitle').value.trim();
    const newNotes = el.querySelector('#gtdNotes').value.trim();
    const newAssign = el.querySelector('#gtdAssign').value || null;
    if (!newText) { el.querySelector('#gtdTitle').focus(); return; }
    const updates = {text: newText, description: newNotes, priority: localPriority, assignedTo: newAssign, subtasks: localSubtasks};
    // Update local state
    Object.assign(task, updates);
    close();
    renderGroupTaskList();
    await apiUpdateGroupTask(g._id, task.id, updates);
  });

  el.addEventListener('click', e2 => { if (e2.target === el) close(); });
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
      <div id="invError" class="invite-error-msg" style="display:none"></div>
      <!-- Result panel (shown after sending) -->
      <div id="invResult" style="display:none">
        <div id="invStatusMsg" class="invite-status-msg"></div>
        <div class="invite-link-row" id="invLinkRow" style="display:none">
          <p style="margin:0 0 8px;font-size:13px;color:var(--text-secondary)">${tl.invitationShareLink||'Share this link with your friend:'}</p>
          <div class="invite-link-box" id="invLinkBox"></div>
        </div>
        <div class="confirm-actions">
          <button class="confirm-cancel" id="invCopyBtn">${tl.copyLink||'Copy Link'}</button>
          <button class="confirm-ok" style="background:var(--accent)" id="invDoneBtn">${tl.done||'Done'}</button>
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
  let inviteUrl = '';
  el.querySelector('#invCancel').onclick = close;
  el.querySelector('#invSend').onclick = async () => {
    const emailVal = el.querySelector('#invEmail').value.trim();
    if (!emailVal) { el.querySelector('#invEmail').focus(); return; }
    const sendBtn = el.querySelector('#invSend');
    const errEl = el.querySelector('#invError');
    errEl.style.display = 'none';
    sendBtn.disabled = true; sendBtn.textContent = tl.sending || 'Sending...';
    const role = el.querySelector('#invRole').value;
    let res;
    try {
      res = await apiInviteMember(g._id, emailVal, role);
    } catch(err) {
      sendBtn.disabled = false; sendBtn.textContent = tl.sendInvitation||'Send Invitation';
      errEl.textContent = tl.invitationFailed || 'Failed to send invitation. Please try again.';
      errEl.style.display = '';
      return;
    }
    sendBtn.disabled = false; sendBtn.textContent = tl.sendInvitation||'Send Invitation';
    if (res.error) {
      errEl.textContent = res.error === 'already invited'
        ? (tl.alreadyInvited || 'This person has already been invited.')
        : (tl.invitationFailed || 'Failed to send invitation. Please try again.');
      errEl.style.display = '';
      return;
    }
    if (res.inviteUrl) {
      inviteUrl = res.inviteUrl;
      el.querySelector('#invActions').style.display = 'none';
      el.querySelector('#invResult').style.display = '';
      if (res.emailSent) {
        el.querySelector('#invStatusMsg').innerHTML =
          `<div class="invite-status-ok">✅ ${tl.invitationSent||'Invitation sent!'}</div>
           <p class="invite-status-sub">${(tl.invitationSentDesc||'An email has been sent to {email} from noreply@mytasks.bar').replace('{email}','<strong>'+emailVal+'</strong>')}</p>`;
        el.querySelector('#invLinkRow').style.display = 'none';
      } else {
        const noSmtp = !res.smtpConfigured;
        el.querySelector('#invStatusMsg').innerHTML =
          `<div class="invite-status-ok">🔗 ${tl.invitationCreated||'Invitation created'}</div>
           <p class="invite-status-sub" style="color:var(--priority-medium)">${noSmtp ? '⚠️ Email not configured on server — share the link below manually.' : '⚠️ Email could not be sent — share the link below manually.'}</p>`;
        el.querySelector('#invLinkRow').style.display = '';
        el.querySelector('#invLinkBox').textContent = inviteUrl;
      }
      el.querySelector('#invCopyBtn').onclick = () => {
        navigator.clipboard?.writeText(inviteUrl).catch(() => {});
        el.querySelector('#invCopyBtn').textContent = tl.copied||'Copied!';
        setTimeout(() => { el.querySelector('#invCopyBtn').textContent = tl.copyLink||'Copy Link'; }, 2000);
      };
      el.querySelector('#invDoneBtn').onclick = close;
      const updated = await apiLoadGroup(g._id);
      if (updated && !updated.error) state.activeGroup = updated;
    } else {
      errEl.textContent = tl.invitationFailed || 'Failed to send invitation. Please try again.';
      errEl.style.display = '';
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
  const close = () => {
    el.classList.remove('open');
    setTimeout(() => el.remove(), 200);
    // If opened via /settings URL, navigate back to group board
    if (window.location.pathname.endsWith('/settings') && g.slug) {
      navigateTo(`/groups/${g.slug}`, true);
    }
  };
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
  const done = !!raw.done;
  const derivedStatus = raw.status || (done ? 'done' : 'todo');
  return {
    id:             raw.id             || Date.now(),
    text:           raw.text           || '',
    done:           done,
    status:         derivedStatus,
    priority:       raw.priority       || 'none',
    description:    raw.description    || '',
    tags:           raw.tags           || [],
    subtasks:       (raw.subtasks      || []).map(s => ({
      id:          s.id          || Date.now() + Math.random(),
      text:        s.text        || '',
      done:        !!s.done,
      createdAt:   s.createdAt   || Date.now(),
      completedAt: s.completedAt || null,
    })),
    createdAt:      raw.createdAt      || Date.now(),
    completedAt:    raw.completedAt    || null,
    startedAt:      raw.startedAt      || null,
    estimatedHours: raw.estimatedHours != null ? raw.estimatedHours : null,
    dueDate:        raw.dueDate        || null,
    overdueNotified: raw.overdueNotified || false,
    notifyOnDone:   raw.notifyOnDone   || false,
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
  // Delegate to updatePageTitle which handles badge + route-aware titles
  if (typeof updatePageTitle === 'function') { updatePageTitle(); return; }
  if (!state.settings?.notifications?.badgeCount) {
    document.title = t('appTitle');
    return;
  }
  const pending = state.todos.filter(x => getTaskStatus(x) !== 'done').length;
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
  // Re-render groups pages if active (language change)
  if (state.activeGroup && document.getElementById('groupBoardPage').style.display !== 'none') {
    renderGroupBoard();
  } else if (state.groupsView && document.getElementById('groupsPage').style.display !== 'none') {
    apiLoadGroups().then(groups => renderGroupsList(groups));
  }
  // Update document title with new language
  updatePageTitle();
  // Update language list checkmarks
  renderLangList();
  // Update nav toggle title
  updateNavToggle();
  // Re-render charts if open (labels change with language)
  if (inlineAnalyticsOpen) {
    setTimeout(renderInlineAnalytics, 0);
  }
  if (gbAnalyticsOpen && state.activeGroup) {
    setTimeout(renderGbAnalytics, 0);
  }
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

function formatDueBadge(todo) {
  const status = getTaskStatus(todo);
  if (status === 'done') {
    if (todo.completedAt && todo.estimatedHours) {
      const actualMs = todo.completedAt - (todo.startedAt || todo.createdAt);
      const actualH = actualMs / 3600000;
      const diff = actualH - todo.estimatedHours;
      if (diff > 0.5) return `<span class="due-badge" style="color:#F59E0B">Done in ${formatDuration(actualMs)} (est ${todo.estimatedHours}h)</span>`;
      if (diff < -0.5) return `<span class="due-badge" style="color:#22C55E">Done in ${formatDuration(actualMs)} (est ${todo.estimatedHours}h)</span>`;
      return `<span class="due-badge" style="color:#22C55E">Done in ${formatDuration(actualMs)}</span>`;
    }
    return '';
  }
  const now = Date.now();
  let html = '';
  if (todo.estimatedHours) {
    html += `<span class="time-badge">⏱ ${todo.estimatedHours >= 1 ? todo.estimatedHours + 'h' : Math.round(todo.estimatedHours * 60) + 'm'}</span>`;
  }
  if (todo.dueDate) {
    const diff = todo.dueDate - now;
    const diffH = diff / 3600000;
    const diffD = diff / 86400000;
    if (diff < 0) {
      html += `<span class="due-badge overdue">⚠ Overdue by ${formatDuration(-diff)}</span>`;
    } else if (diffH < 24) {
      html += `<span class="due-badge due-soon">Due in ${Math.round(diffH)}h</span>`;
    } else if (diffD < 2) {
      html += `<span class="due-badge due-soon">Due tomorrow</span>`;
    } else {
      html += `<span class="due-badge due-ok">Due in ${Math.round(diffD)}d</span>`;
    }
  }
  return html;
}

function taskCardHTML(todo) {
  const status   = getTaskStatus(todo);
  const dur      = status === 'done' && todo.completedAt ? duration(todo.createdAt, todo.completedAt) : '';
  const p        = todo.priority || 'none';
  const blocked  = status !== 'done' && todo.subtasks && todo.subtasks.some(s => !s.done);
  const isInProg = status === 'in_progress';
  const isDone   = status === 'done';
  const cbClass  = isDone ? ' ticked' : isInProg ? ' in-progress' : '';
  const cardClass = isDone ? ' done-card' : isInProg ? ' in-progress-card' : '';
  const dueBadge = formatDueBadge(todo);
  return `<div class="task-card${cardClass}" data-id="${todo.id}" data-p="${p}" role="button" tabindex="0">
  <div class="task-inner">
    <button class="task-cb${cbClass}${blocked ? ' blocked' : ''}" data-check="${todo.id}" aria-label="Cycle status"${blocked ? ' title="Complete all sub-tasks first"' : ''}>
      ${isDone ? `<svg width="10" height="8" viewBox="0 0 10 8" fill="none"><path d="M1 4L3.5 6.5L9 1" stroke="white" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"/></svg>` : ''}
    </button>
    <div class="task-body">
      <div class="task-title">${esc(todo.text)}</div>
      <div class="task-meta">
        <span class="task-time">${relativeTime(todo.createdAt)}</span>
        ${dur ? `<span class="task-dur">${t('took')} ${dur}</span>` : ''}
        ${dueBadge}
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

  // Progress — 3 segments
  const doneCount  = state.todos.filter(x => getTaskStatus(x) === 'done').length;
  const progCount  = state.todos.filter(x => getTaskStatus(x) === 'in_progress').length;
  const total      = state.todos.length;
  const pct        = total ? Math.round(doneCount / total * 100) : 0;
  const progPct    = total ? Math.round(progCount / total * 100) : 0;
  const trackEl    = document.querySelector('.progress-track-mini');
  if (trackEl) {
    trackEl.innerHTML = `<div class="progress-fill progress-fill-done" style="width:${pct}%;display:inline-block;height:100%;vertical-align:top;border-radius:999px 0 0 999px"></div><div class="progress-fill progress-fill-prog" style="width:${progPct}%;display:inline-block;height:100%;vertical-align:top"></div>`;
  }
  document.getElementById('progPct').textContent   = pct + '%';
  const activePendingCount = total - doneCount;
  document.getElementById('statsText').textContent = (typeof t('remaining') === 'function' ? t('remaining')(activePendingCount) : '') + ' · ' + (typeof t('completed') === 'function' ? t('completed')(doneCount) : '');
  document.getElementById('statsCount').textContent = total ? `${doneCount} / ${total}` : '';

  // Task list
  const visible = state.todos.filter(todo => {
    const s = getTaskStatus(todo);
    if (state.filter === 'all') return true;
    if (state.filter === 'done') return s === 'done';
    return s !== 'done'; // active = todo or in_progress
  });

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
  // Re-render inline analytics if open
  if (typeof renderInlineAnalytics === 'function') {
    setTimeout(renderInlineAnalytics, 0);
  }
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
  const currentStatus = getTaskStatus(todo);
  // Cycle: todo → in_progress → done → todo
  let nextStatus;
  if (currentStatus === 'todo') {
    nextStatus = 'in_progress';
  } else if (currentStatus === 'in_progress') {
    // Block marking done while subtasks remain incomplete
    if (todo.subtasks && todo.subtasks.some(s => !s.done)) return;
    nextStatus = 'done';
  } else {
    nextStatus = 'todo';
  }

  todo.status = nextStatus;
  if (nextStatus === 'in_progress') {
    todo.done = false;
    todo.startedAt = Date.now();
    todo.completedAt = null;
  } else if (nextStatus === 'done') {
    todo.done = true;
    todo.completedAt = Date.now();
    if (checkEl) {
      const rect = checkEl.getBoundingClientRect();
      burst(rect.left + rect.width / 2, rect.top + rect.height / 2);
    }
    if (todo.notifyOnDone) {
      showToast(`✓ ${t('taskDone')}`, 'success');
      playNotifSound();
    }
  } else {
    todo.done = false;
    todo.completedAt = null;
    todo.startedAt = null;
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
  navigateTo('/analytics');
}

function closeCharts() {
  if (activeChartInstance) { activeChartInstance.destroy(); activeChartInstance = null; }
  navigateTo('/mytasks');
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
  const estimateEl = document.getElementById('estimateSelect');
  const dueDateEl = document.getElementById('dueDateInput');
  const dueTimeEl = document.getElementById('dueTimeInput');
  let estimatedHours = estimateEl && estimateEl.value ? parseFloat(estimateEl.value) : null;
  let dueDate = null;
  if (dueDateEl && dueDateEl.value) {
    const timeStr = dueTimeEl && dueTimeEl.value ? dueTimeEl.value : '00:00';
    dueDate = new Date(`${dueDateEl.value}T${timeStr}`).getTime();
  }
  const todo = migrateTodo({
    id: Date.now(), text: text.trim(), done: false,
    status: 'todo',
    priority: state.newPriority, createdAt: Date.now(),
    notifyOnDone,
    estimatedHours,
    dueDate,
  });
  if (notifyCheck) notifyCheck.checked = false;
  if (estimateEl) estimateEl.value = '';
  if (dueDateEl) dueDateEl.value = '';
  if (dueTimeEl) dueTimeEl.value = '';
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
  // Only update personal task filter buttons (skip group board filter buttons which lack data-filter)
  document.querySelectorAll('.filter-btn[data-filter]').forEach(b =>
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

  // Status dropdown
  const statusEl = document.getElementById('drawerStatus');
  if (statusEl) {
    statusEl.value = getTaskStatus(todo);
  }

  // Drawer estimate + due date
  const drawerEst = document.getElementById('drawerEstimate');
  if (drawerEst) drawerEst.value = todo.estimatedHours != null ? String(todo.estimatedHours) : '';
  const drawerDD = document.getElementById('drawerDueDate');
  const drawerDT = document.getElementById('drawerDueTime');
  if (drawerDD && todo.dueDate) {
    const d = new Date(todo.dueDate);
    drawerDD.value = d.toISOString().slice(0, 10);
    if (drawerDT) drawerDT.value = d.toTimeString().slice(0, 5);
  } else {
    if (drawerDD) drawerDD.value = '';
    if (drawerDT) drawerDT.value = '';
  }

  // Time info block
  const status = getTaskStatus(todo);
  const now = Date.now();
  let timeHTML = `<div class="time-row"><span class="time-badge">${t('created')}</span>${absTime(todo.createdAt)}</div>`;
  if (todo.startedAt && status !== 'todo') {
    timeHTML += `<div class="time-row"><span class="time-badge">${t('elapsed')}</span>${duration(todo.startedAt, todo.completedAt || now)} ${status === 'in_progress' ? `<em>(${t('running')})</em>` : ''}</div>`;
  }
  if (todo.completedAt) {
    timeHTML += `<div class="time-row"><span class="time-badge">${t('completedAt')}</span>${absTime(todo.completedAt)}</div>`;
    timeHTML += `<div class="time-row"><span class="time-badge">${t('took')}</span>${duration(todo.createdAt, todo.completedAt)}</div>`;
    if (todo.estimatedHours) {
      const actualMs = todo.completedAt - (todo.startedAt || todo.createdAt);
      const actualH = actualMs / 3600000;
      const diff = actualH - todo.estimatedHours;
      const perfClass = diff > 0.5 ? 'time-perf-yellow' : 'time-perf-green';
      timeHTML += `<div class="time-row time-info-block"><span class="${perfClass}">${diff > 0.5 ? t('overEstimate') : diff < -0.5 ? t('underEstimate') : t('onTime')}</span></div>`;
    }
  }
  if (todo.dueDate && status !== 'done') {
    const diff = todo.dueDate - now;
    const cls = diff < 0 ? 'time-perf-red' : diff < 86400000 ? 'time-perf-yellow' : 'time-perf-green';
    const label = diff < 0 ? `⚠ ${t('overdueBy').replace('{time}', formatDuration(-diff))}` : `${t('dueIn').replace('{time}', formatDuration(diff))}`;
    timeHTML += `<div class="time-row"><span class="${cls}">${label}</span></div>`;
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
  const titleEl  = document.getElementById('drawerTitle');
  const descEl   = document.getElementById('drawerDesc');
  const statusEl = document.getElementById('drawerStatus');
  const estEl    = document.getElementById('drawerEstimate');
  const ddEl     = document.getElementById('drawerDueDate');
  const dtEl     = document.getElementById('drawerDueTime');
  if (titleEl) todo.text        = titleEl.value.trim() || todo.text;
  if (descEl)  todo.description = descEl.value;
  if (statusEl && statusEl.value) {
    const newStatus = statusEl.value;
    if (newStatus !== getTaskStatus(todo)) {
      todo.status = newStatus;
      if (newStatus === 'done') {
        todo.done = true;
        todo.completedAt = todo.completedAt || Date.now();
      } else if (newStatus === 'in_progress') {
        todo.done = false;
        todo.completedAt = null;
        if (!todo.startedAt) todo.startedAt = Date.now();
      } else {
        todo.done = false;
        todo.completedAt = null;
        todo.startedAt = null;
      }
    }
  }
  if (estEl) todo.estimatedHours = estEl.value ? parseFloat(estEl.value) : null;
  if (ddEl && ddEl.value) {
    const timeStr = dtEl && dtEl.value ? dtEl.value : '00:00';
    todo.dueDate = new Date(`${ddEl.value}T${timeStr}`).getTime();
  } else if (ddEl) {
    todo.dueDate = null;
  }
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
  const open   = state.todos.filter(x => getTaskStatus(x) !== 'done').length;
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

// ─── Router ───────────────────────────────────────────────────────────────────
function updateNavToggle() {
  const btn = document.getElementById('navToggle');
  if (!btn) return;
  const tl = TL[state.lang] || TL.en;
  const onGroups = window.location.pathname.startsWith('/groups');
  if (onGroups) {
    btn.title = tl.personalTasks || 'My Tasks';
    btn.innerHTML = `<svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><path d="M20 21v-2a4 4 0 0 0-4-4H8a4 4 0 0 0-4 4v2"/><circle cx="12" cy="7" r="4"/></svg>`;
    btn.onclick = () => navigateTo('/mytasks');
  } else {
    btn.title = tl.groups || 'Groups';
    btn.innerHTML = `<svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><path d="M17 21v-2a4 4 0 0 0-4-4H5a4 4 0 0 0-4 4v2"/><circle cx="9" cy="7" r="4"/><path d="M23 21v-2a4 4 0 0 0-3-3.87"/><path d="M16 3.13a4 4 0 0 1 0 7.75"/></svg>`;
    btn.onclick = () => navigateTo('/groups');
  }
}

function navigateTo(path, replace = false) {
  if (replace) {
    history.replaceState({ path }, '', path);
  } else {
    history.pushState({ path }, '', path);
  }
  handleRoute(path);
  updateNavToggle();
}

async function handleRoute(path) {
  const tl = TL[state.lang] || TL.en;
  const appName = tl.appTitle || 'My Tasks';

  // Close any open overlays before switching view
  if (state.activeDrawer !== null) closeDrawer();
  document.getElementById('gtDetailModal')?.remove();

  if (path === '/mytasks' || path === '/') {
    state.groupsView = false;
    state.activeGroup = null;
    state.chartView = false;
    document.getElementById('chartsView').style.display = 'none';
    document.getElementById('groupsPage').style.display = 'none';
    document.getElementById('groupBoardPage').style.display = 'none';
    document.getElementById('mainContent').style.display = '';
    document.title = appName;
    updateActiveNavigation(path);

  } else if (path === '/analytics') {
    // Redirect analytics to mytasks — analytics is now inline
    navigateTo('/mytasks', true);
    return;

  } else if (path === '/groups') {
    state.groupsView = true;
    state.activeGroup = null;
    state.chartView = false;
    document.getElementById('chartsView').style.display = 'none';
    document.getElementById('mainContent').style.display = 'none';
    document.getElementById('groupBoardPage').style.display = 'none';
    document.getElementById('groupsPage').style.display = '';
    document.title = `${tl.groups||'Groups'} — ${appName}`;
    updateActiveNavigation(path);
    const groups = await apiLoadGroups();
    renderGroupsList(groups);

  } else {
    // Try /groups/{slug} or /groups/{slug}/settings
    const boardMatch = path.match(/^\/groups\/([^/]+)$/);
    const settingsMatch = path.match(/^\/groups\/([^/]+)\/settings$/);
    if (boardMatch || settingsMatch) {
      const slug = (boardMatch || settingsMatch)[1];
      state.groupsView = false;
      state.chartView = false;
      document.getElementById('chartsView').style.display = 'none';
      document.getElementById('groupsPage').style.display = 'none';
      document.getElementById('mainContent').style.display = 'none';
      document.getElementById('groupBoardPage').style.display = '';
      updateActiveNavigation('/groups');
      // Load group by slug
      let g = null;
      try {
        g = await fetch(`/api/groups/by-slug/${encodeURIComponent(slug)}`).then(r => r.json());
      } catch(_) {}
      if (!g || g.error) {
        // Fallback: maybe it's an ID not a slug
        try {
          g = await apiLoadGroup(slug);
        } catch(_) {}
      }
      if (g && !g.error) {
        state.activeGroup = g;
        state.groupFilter = 'all';
        state.groupSort = 'newest';
        renderGroupBoard();
        document.title = `${g.name} — ${appName}`;
        if (settingsMatch) {
          showMembersPanel();
        }
      } else {
        // Group not found — go back to groups list
        navigateTo('/groups', true);
      }
      return;
    }
    // Unknown path — go to mytasks
    navigateTo('/mytasks', true);
  }
}

function updateActiveNavigation(path) {
  const navToggle = document.getElementById('navToggle');
  if (navToggle) navToggle.classList.toggle('nav-active', path === '/groups' || path.startsWith('/groups/'));
}

function updatePageTitle() {
  const tl = TL[state.lang] || TL.en;
  const appName = tl.appTitle || 'My Tasks';
  const path = window.location.pathname;
  let title = appName;
  if (path === '/analytics') {
    title = `${tl.charts||'Analytics'} — ${appName}`;
  } else if (path === '/groups') {
    title = `${tl.groups||'Groups'} — ${appName}`;
  } else if (state.activeGroup && path.startsWith('/groups/')) {
    title = `${state.activeGroup.name} — ${appName}`;
  }
  // Prepend unread count if badge enabled
  if (state.unreadCount > 0 && state.settings?.notifications?.badgeCount) {
    title = `(${state.unreadCount}) ${title}`;
  }
  document.title = title;
}

window.addEventListener('popstate', e => {
  const path = (e.state && e.state.path) || window.location.pathname;
  if (state.activeDrawer !== null) {
    closeDrawer();
    history.pushState({ path: window.location.pathname }, '', window.location.pathname);
  } else if (menuOpen) {
    closeMenu();
    history.pushState({ path: window.location.pathname }, '', window.location.pathname);
  } else {
    handleRoute(path);
  }
});

// ─── Inline Analytics ─────────────────────────────────────────────────────────
let inlineAnalyticsOpen = localStorage.getItem('analyticsOpen') === '1';
let inlineChartInstance = null;
let inlineChartType = 'pie';

function renderInlineAnalytics() {
  if (!inlineAnalyticsOpen) return;
  const panel = document.getElementById('analyticsPanel');
  if (!panel || panel.style.display === 'none') return;
  const todos = state.todos;
  const total = todos.length;
  const done = todos.filter(t => getTaskStatus(t) === 'done').length;
  const inProg = todos.filter(t => getTaskStatus(t) === 'in_progress').length;
  const pending = total - done - inProg;

  const tl = TL[state.lang] || TL.en;
  const statsEl = document.getElementById('inlineStatsGrid');
  if (statsEl) {
    statsEl.innerHTML = `
      <span>${total} ${tl.total||'total'}</span>
      <span class="done-stat">${done} ${tl.taskDone||'done'}</span>
      <span class="prog-stat">${inProg} ${tl.inProgress||'in progress'}</span>
      <span class="pend-stat">${pending} ${tl.todo||'todo'}</span>
    `;
  }

  if (inlineChartInstance) { inlineChartInstance.destroy(); inlineChartInstance = null; }
  const ctx = document.getElementById('inlineChart')?.getContext('2d');
  if (!ctx) return;

  if (inlineChartType === 'pie') {
    inlineChartInstance = new Chart(ctx, {
      type: 'doughnut',
      data: {
        labels: [tl.taskDone||'Done', tl.inProgress||'In Progress', tl.todo||'Todo'],
        datasets: [{ data: [done, inProg, pending], backgroundColor: ['#22C55E','#3B82F6','#9CA3AF'] }]
      },
      options: { responsive: true, plugins: { legend: { position: 'bottom' } } }
    });
  } else {
    const pCounts = { high: 0, medium: 0, low: 0, none: 0 };
    todos.forEach(tk => { pCounts[tk.priority || 'none']++; });
    inlineChartInstance = new Chart(ctx, {
      type: 'bar',
      data: {
        labels: [tl.priorityHigh||'High', tl.priorityMedium||'Medium', tl.priorityLow||'Low', tl.priorityNone||'None'],
        datasets: [{ label: tl.tasks||'Tasks', data: [pCounts.high, pCounts.medium, pCounts.low, pCounts.none],
          backgroundColor: ['#EF4444','#F59E0B','#6366F1','#9CA3AF'] }]
      },
      options: { responsive: true, plugins: { legend: { display: false } }, scales: { y: { beginAtZero: true, ticks: { stepSize: 1 } } } }
    });
  }
}

// ─── Group Dashboard (Jira-style) ────────────────────────────────────────────
function renderGbDashboard() {
  const g = state.activeGroup;
  const tl = TL[state.lang] || TL.en;
  const now = Date.now();
  const tasks = g.tasks || [];

  const done = tasks.filter(t => t.done || t.status === 'done').length;
  const inProg = tasks.filter(t => t.status === 'in_progress').length;
  const total = tasks.length;
  const overdueArr = tasks.filter(t => t.dueDate && t.dueDate < now && !t.done && t.status !== 'done');
  const todoArr = tasks.filter(t => !t.done && t.status !== 'done' && t.status !== 'in_progress');

  const donePct = total ? Math.round(done/total*100) : 0;
  const inProgPct = total ? Math.round(inProg/total*100) : 0;
  const overduePct = total ? Math.round(overdueArr.length/total*100) : 0;

  const members = (g.members||[]).filter(m=>m.status==='active');

  function memberRow(m) {
    const mt = tasks.filter(t=>t.assignedTo===m.userId);
    const md = mt.filter(t=>t.done||t.status==='done').length;
    const mi = mt.filter(t=>t.status==='in_progress').length;
    const pct = mt.length ? Math.round(md/mt.length*100) : 0;
    const status = pct>=60?'🟢':pct>=30?'🟡':'🔴';
    const avatar = m.picture
      ? `<img class="gm-avatar" src="${m.picture}" style="width:28px;height:28px">`
      : `<div class="gm-avatar gm-avatar-fb" style="width:28px;height:28px;font-size:11px">${(m.name||'?')[0].toUpperCase()}</div>`;
    const doneW = mt.length ? (md/mt.length*100) : 0;
    const inProgW = mt.length ? (mi/mt.length*100) : 0;
    return `<div class="dash-member-row">
      <div class="dash-member-info">${avatar}<span class="dash-member-name">${esc(m.name||'')}</span></div>
      <div class="dash-bar-wrap">
        <div class="dash-bar-bg">
          <div class="dash-bar-done" style="width:${doneW}%"></div>
          <div class="dash-bar-prog" style="width:${inProgW}%;margin-left:${doneW}%"></div>
        </div>
      </div>
      <span class="dash-member-frac">${mt.length} ${tl.tasks||'tasks'}</span>
      <span class="dash-member-pct">${pct}%</span>
      <span>${status}</span>
    </div>`;
  }

  function taskMiniCard(task) {
    const assignee = members.find(m=>m.userId===task.assignedTo);
    const avt = assignee?.picture
      ? `<img class="gm-avatar" src="${assignee.picture}" style="width:20px;height:20px">`
      : assignee ? `<div class="gm-avatar gm-avatar-fb" style="width:20px;height:20px;font-size:9px">${(assignee.name||'?')[0].toUpperCase()}</div>` : '';
    const isOverdue = task.dueDate && task.dueDate < now && !task.done && task.status !== 'done';
    const priorityColors = {high:'var(--priority-high)',medium:'var(--priority-medium)',low:'var(--priority-low)',none:'var(--text-tertiary)'};
    const pColor = priorityColors[task.priority||'none'];
    return `<div class="dash-task-card${isOverdue?' dash-task-overdue':''}">
      <div class="dash-task-title">${esc(task.text||'')}</div>
      <div class="dash-task-meta">
        ${avt}<span class="dash-task-assignee">${esc(assignee?.name||tl.unassigned||'Unassigned')}</span>
        <span class="dash-priority-dot" style="background:${pColor}"></span>
      </div>
    </div>`;
  }

  const todoTasks = tasks.filter(t=>!t.done&&t.status!=='done'&&t.status!=='in_progress');
  const inProgTasks = tasks.filter(t=>t.status==='in_progress');
  const doneTasks = tasks.filter(t=>t.done||t.status==='done');

  return `<div class="gb-dashboard">
    <div class="dash-cards">
      <div class="dash-card">
        <div class="dash-card-num">${total}</div>
        <div class="dash-card-label">${tl.total||'Total'}</div>
      </div>
      <div class="dash-card dash-card-done">
        <div class="dash-card-num">${done}</div>
        <div class="dash-card-label">${tl.taskDone||'Done'}</div>
        <div class="dash-card-pct">${donePct}%</div>
      </div>
      <div class="dash-card dash-card-prog">
        <div class="dash-card-num">${inProg}</div>
        <div class="dash-card-label">${tl.inProgress||'In Progress'}</div>
        <div class="dash-card-pct">${inProgPct}%</div>
      </div>
      <div class="dash-card dash-card-over">
        <div class="dash-card-num">${overdueArr.length}</div>
        <div class="dash-card-label">${tl.overdueCount||'Overdue'}</div>
        <div class="dash-card-pct">${overduePct}%</div>
      </div>
    </div>
    ${members.length > 0 ? `
    <div class="dash-section">
      <div class="dash-section-title">${tl.memberWorkload||'Member Workload'}</div>
      <div class="dash-members">${members.map(m=>memberRow(m)).join('')}</div>
    </div>` : ''}
    <div class="dash-section">
      <div class="dash-section-title">${tl.statusBoard||'Status Board'}</div>
      <div class="dash-kanban">
        <div class="dash-col">
          <div class="dash-col-header dash-col-todo">${tl.todo||'To Do'} <span class="dash-col-count">${todoTasks.length}</span></div>
          <div class="dash-col-body">${todoTasks.map(t=>taskMiniCard(t)).join('')||`<div class="dash-empty">${tl.noData||'No tasks'}</div>`}</div>
        </div>
        <div class="dash-col">
          <div class="dash-col-header dash-col-prog">${tl.inProgress||'In Progress'} <span class="dash-col-count">${inProgTasks.length}</span></div>
          <div class="dash-col-body">${inProgTasks.map(t=>taskMiniCard(t)).join('')||`<div class="dash-empty">${tl.noData||'No tasks'}</div>`}</div>
        </div>
        <div class="dash-col">
          <div class="dash-col-header dash-col-done">${tl.taskDone||'Done'} <span class="dash-col-count">${doneTasks.length}</span></div>
          <div class="dash-col-body">${doneTasks.map(t=>taskMiniCard(t)).join('')||`<div class="dash-empty">${tl.noData||'No tasks'}</div>`}</div>
        </div>
      </div>
    </div>
    <div class="dash-section" id="gbActivityFeed">
      <div class="dash-section-title">${tl.recentActivity||'Recent Activity'}</div>
      <div class="dash-activity-list" id="gbActivityList">
        <div class="dash-empty">${tl.noData||'Loading...'}</div>
      </div>
    </div>
  </div>`;
}

async function loadGbActivities() {
  const g = state.activeGroup;
  const tl = TL[state.lang] || TL.en;
  const listEl = document.getElementById('gbActivityList');
  if (!listEl || !g) return;
  try {
    const r = await fetch(`/api/groups/${g._id}/activities`);
    const acts = await r.json();
    if (!Array.isArray(acts) || !acts.length) {
      listEl.innerHTML = `<div class="dash-empty">${tl.noData||'No activity yet'}</div>`;
      return;
    }
    listEl.innerHTML = acts.slice(0,10).map(a => {
      const timeStr = relativeTime(a.timestamp);
      const verb = {
        task_created: tl.actTaskCreated||'created',
        task_completed: tl.actTaskCompleted||'completed',
        task_started: tl.actTaskStarted||'started',
        task_assigned: tl.actTaskAssigned||'assigned',
        member_joined: tl.actMemberJoined||'joined the group',
      }[a.type] || a.type;
      const taskPart = a.taskText ? ` "${esc(a.taskText)}"` : '';
      const targetPart = a.targetUser ? ` → ${esc(a.targetUser)}` : '';
      return `<div class="dash-activity-item">
        <span class="dash-activity-dot"></span>
        <span class="dash-activity-text"><strong>${esc(a.userName||'')}</strong> ${verb}${taskPart}${targetPart}</span>
        <span class="dash-activity-time">${timeStr}</span>
      </div>`;
    }).join('');
  } catch(_) {
    listEl.innerHTML = `<div class="dash-empty">${tl.noData||'No activity yet'}</div>`;
  }
}

// ─── Group (Team) Analytics ───────────────────────────────────────────────────
const MEMBER_COLORS = ['#3B82F6','#EF4444','#22C55E','#F59E0B','#8B5CF6','#EC4899','#14B8A6','#F97316'];
let gbAnalyticsOpen = false;
let gbChartInstance = null;
let gbChartTab = 'dashboard';

function renderGbAnalytics() {
  if (!gbAnalyticsOpen || !state.activeGroup) return;
  const panel = document.getElementById('gbAnalyticsPanel');
  if (!panel || panel.style.display === 'none') return;
  const tl = TL[state.lang] || TL.en;

  if (gbChartTab === 'dashboard') {
    const dashEl = document.getElementById('gbAnalyticsInfo');
    const canvasWrap = panel.querySelector('.chart-container-inline');
    if (canvasWrap) canvasWrap.style.display = 'none';
    if (dashEl) {
      dashEl.innerHTML = renderGbDashboard();
      loadGbActivities();
    }
    return;
  }

  const g = state.activeGroup;
  const tasks = g.tasks || [];
  const members = g.members.filter(m => m.status === 'active');
  const now = Date.now();

  const canvasWrap = panel.querySelector('.chart-container-inline');
  if (canvasWrap) canvasWrap.style.display = '';

  if (gbChartInstance) { gbChartInstance.destroy(); gbChartInstance = null; }
  const ctx = document.getElementById('gbChart')?.getContext('2d');
  if (!ctx) return;

  const infoEl = document.getElementById('gbAnalyticsInfo');

  if (gbChartTab === 'overview') {
    const done = tasks.filter(t => getTaskStatus(t) === 'done').length;
    const inProg = tasks.filter(t => getTaskStatus(t) === 'in_progress').length;
    const todo = tasks.length - done - inProg;
    const overdue = tasks.filter(t => t.dueDate && t.dueDate < now && getTaskStatus(t) !== 'done').length;
    gbChartInstance = new Chart(ctx, {
      type: 'doughnut',
      data: { labels: [tl.taskDone||'Done', tl.inProgress||'In Progress', tl.todo||'Todo'], datasets: [{ data: [done, inProg, todo], backgroundColor: ['#22C55E','#3B82F6','#9CA3AF'] }] },
      options: { responsive: true, plugins: { legend: { position: 'bottom' } } }
    });
    if (infoEl) infoEl.innerHTML = `<div class="analytics-stats-row"><span>${tl.total||'Total'}: ${tasks.length}</span><span class="done-stat">${tl.taskDone||'Done'}: ${done}</span><span class="prog-stat">${tl.inProgress||'In Progress'}: ${inProg}</span><span style="color:#EF4444">${tl.overdueCount||'Overdue'}: ${overdue}</span></div>`;

  } else if (gbChartTab === 'members') {
    const labels = members.map(m => m.name.split(' ')[0]);
    const doneCounts = members.map(m => tasks.filter(t => t.assignedTo === m.userId && getTaskStatus(t) === 'done').length);
    const progCounts = members.map(m => tasks.filter(t => t.assignedTo === m.userId && getTaskStatus(t) === 'in_progress').length);
    const todoCounts = members.map(m => tasks.filter(t => t.assignedTo === m.userId && getTaskStatus(t) === 'todo').length);
    gbChartInstance = new Chart(ctx, {
      type: 'bar',
      data: { labels, datasets: [
        { label: tl.taskDone||'Done', data: doneCounts, backgroundColor: '#22C55E' },
        { label: tl.inProgress||'In Progress', data: progCounts, backgroundColor: '#3B82F6' },
        { label: tl.todo||'Todo', data: todoCounts, backgroundColor: '#9CA3AF' }
      ]},
      options: { responsive: true, scales: { x: { stacked: true }, y: { stacked: true, beginAtZero: true, ticks: { stepSize: 1 } } }, plugins: { legend: { position: 'bottom' } } }
    });
    if (infoEl) infoEl.innerHTML = '';

  } else if (gbChartTab === 'priority') {
    const priorities = ['high','medium','low','none'];
    const datasets = members.map((m, i) => ({
      label: m.name.split(' ')[0],
      data: priorities.map(p => tasks.filter(t => t.assignedTo === m.userId && (t.priority||'none') === p).length),
      backgroundColor: MEMBER_COLORS[i % MEMBER_COLORS.length],
    }));
    gbChartInstance = new Chart(ctx, {
      type: 'bar',
      data: { labels: [tl.priorityHigh||'High', tl.priorityMedium||'Medium', tl.priorityLow||'Low', tl.priorityNone||'None'], datasets },
      options: { responsive: true, scales: { x: { stacked: false }, y: { beginAtZero: true, ticks: { stepSize: 1 } } }, plugins: { legend: { position: 'bottom' } } }
    });
    if (infoEl) infoEl.innerHTML = '';

  } else if (gbChartTab === 'time') {
    const labels = members.map(m => m.name.split(' ')[0]);
    const avgTimes = members.map(m => {
      const completed = tasks.filter(t => t.assignedTo === m.userId && t.completedAt && t.createdAt);
      if (!completed.length) return 0;
      const avg = completed.reduce((s, t) => s + (t.completedAt - t.createdAt), 0) / completed.length;
      return Math.round(avg / 3600000 * 10) / 10;
    });
    gbChartInstance = new Chart(ctx, {
      type: 'bar',
      data: { labels, datasets: [{ label: tl.avgTime||'Avg Hours', data: avgTimes, backgroundColor: MEMBER_COLORS }] },
      options: { responsive: true, plugins: { legend: { display: false } }, scales: { y: { beginAtZero: true } } }
    });
    if (infoEl) infoEl.innerHTML = labels.map((l, i) => `<span>${l}: ${avgTimes[i] ? avgTimes[i]+'h' : tl.noData||'no data'}</span>`).join(' · ');

  } else if (gbChartTab === 'performance') {
    const weekAgo = now - 7 * 24 * 3600000;
    const memberStats = members.map((m, i) => {
      const assigned = tasks.filter(t => t.assignedTo === m.userId);
      const completedThisWeek = assigned.filter(t => t.completedAt && t.completedAt > weekAgo);
      const overdueTasks = assigned.filter(t => t.dueDate && t.dueDate < now && getTaskStatus(t) !== 'done');
      const overdueRate = assigned.length ? Math.round(overdueTasks.length / assigned.length * 100) : 0;
      const onTimeTasks = assigned.filter(t => t.completedAt && t.dueDate && t.completedAt <= t.dueDate);
      const onTimeRate = assigned.filter(t => t.completedAt && t.dueDate).length
        ? Math.round(onTimeTasks.length / assigned.filter(t => t.completedAt && t.dueDate).length * 100) : 100;
      const emoji = overdueRate < 10 ? '🟢' : overdueRate < 30 ? '🟡' : '🔴';
      return { name: m.name.split(' ')[0], completedThisWeek: completedThisWeek.length, overdueRate, onTimeRate, emoji, color: MEMBER_COLORS[i % MEMBER_COLORS.length] };
    });
    gbChartInstance = new Chart(ctx, {
      type: 'bar',
      data: {
        labels: memberStats.map(s => s.name),
        datasets: [{ label: tl.tasksCompleted||'Tasks This Week', data: memberStats.map(s => s.completedThisWeek), backgroundColor: memberStats.map(s => s.color) }]
      },
      options: { indexAxis: 'y', responsive: true, plugins: { legend: { display: false } }, scales: { x: { beginAtZero: true, ticks: { stepSize: 1 } } } }
    });
    if (infoEl) {
      infoEl.innerHTML = `<div class="perf-table">${memberStats.map(s =>
        `<div class="perf-row"><span>${s.emoji} ${s.name}</span><span>${tl.taskDone||'Done'}: ${s.completedThisWeek}</span><span>${tl.overdueCount||'Overdue'}: ${s.overdueRate}%</span><span>${tl.onTimeRate||'On-time'}: ${s.onTimeRate}%</span></div>`
      ).join('')}</div>`;
    }
  }
}

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

  // ── More options toggle ────────────────────────────────────────────────────
  const moreOptionsToggle = document.getElementById('moreOptionsToggle');
  const moreOptions = document.getElementById('moreOptions');
  if (moreOptionsToggle && moreOptions) {
    moreOptionsToggle.addEventListener('mousedown', e => e.preventDefault());
    moreOptionsToggle.addEventListener('click', () => {
      const open = moreOptions.style.display !== 'none';
      moreOptions.style.display = open ? 'none' : '';
      moreOptionsToggle.textContent = (open ? '▶' : '▼') + ' More options';
    });
  }

  // ── Filters ───────────────────────────────────────────────────────────────
  document.querySelectorAll('.filter-btn[data-filter]').forEach(b =>
    b.addEventListener('click', () => setFilter(b.dataset.filter))
  );

  // ── Clear done ────────────────────────────────────────────────────────────
  document.getElementById('clearDoneBtn').addEventListener('click', async () => {
    const doneCards = document.querySelectorAll('.task-card.done-card');
    if (!doneCards.length) return;
    doneCards.forEach(card => card.classList.add('removing'));
    await new Promise(r => setTimeout(r, 420));
    state.todos = state.todos.filter(x => getTaskStatus(x) !== 'done');
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

  // Status dropdown change
  document.getElementById('drawerStatus')?.addEventListener('change', async () => {
    flushDrawerSave();
    const todo = state.todos.find(x => x.id === state.activeDrawer);
    if (todo) renderDrawer(todo);
    render();
    await apiSave();
  });

  // Estimate / due date change
  document.getElementById('drawerEstimate')?.addEventListener('change', scheduleDrawerSave);
  document.getElementById('drawerDueDate')?.addEventListener('change', scheduleDrawerSave);
  document.getElementById('drawerDueTime')?.addEventListener('change', scheduleDrawerSave);

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

  // ── Inline Analytics (personal tasks) ────────────────────────────────────
  const analyticsToggle = document.getElementById('analyticsToggle');
  const analyticsPanel  = document.getElementById('analyticsPanel');
  const analyticsArrow  = document.getElementById('analyticsArrow');
  if (analyticsToggle) {
    // Set initial state
    if (inlineAnalyticsOpen && analyticsPanel) {
      analyticsPanel.style.display = '';
      if (analyticsArrow) analyticsArrow.textContent = '▼';
    }
    analyticsToggle.addEventListener('click', () => {
      inlineAnalyticsOpen = !inlineAnalyticsOpen;
      localStorage.setItem('analyticsOpen', inlineAnalyticsOpen ? '1' : '0');
      if (analyticsPanel) analyticsPanel.style.display = inlineAnalyticsOpen ? '' : 'none';
      if (analyticsArrow) analyticsArrow.textContent = inlineAnalyticsOpen ? '▼' : '▶';
      if (inlineAnalyticsOpen) renderInlineAnalytics();
    });
  }
  document.getElementById('inlineChartTabs')?.addEventListener('click', e => {
    const tab = e.target.closest('[data-chart]');
    if (!tab) return;
    inlineChartType = tab.dataset.chart;
    document.querySelectorAll('#inlineChartTabs .chart-tab').forEach(b => b.classList.toggle('active', b.dataset.chart === inlineChartType));
    renderInlineAnalytics();
  });

  // ── Group inline analytics ────────────────────────────────────────────────
  const gbAnalyticsToggle = document.getElementById('gbAnalyticsToggle');
  const gbAnalyticsPanel  = document.getElementById('gbAnalyticsPanel');
  const gbAnalyticsArrow  = document.getElementById('gbAnalyticsArrow');
  if (gbAnalyticsToggle) {
    gbAnalyticsToggle.addEventListener('click', () => {
      gbAnalyticsOpen = !gbAnalyticsOpen;
      if (gbAnalyticsPanel) gbAnalyticsPanel.style.display = gbAnalyticsOpen ? '' : 'none';
      if (gbAnalyticsArrow) gbAnalyticsArrow.textContent = gbAnalyticsOpen ? '▼' : '▶';
      if (gbAnalyticsOpen) renderGbAnalytics();
    });
  }
  document.getElementById('gbChartTabs')?.addEventListener('click', e => {
    const tab = e.target.closest('[data-gbtab]');
    if (!tab) return;
    gbChartTab = tab.dataset.gbtab;
    document.querySelectorAll('#gbChartTabs .chart-tab').forEach(b => b.classList.toggle('active', b.dataset.gbtab === gbChartTab));
    renderGbAnalytics();
  });

  // ── Live elapsed timer ────────────────────────────────────────────────────
  setInterval(() => {
    // Re-render drawer time info if open and task is in_progress
    if (state.activeDrawer !== null) {
      const todo = state.todos.find(x => x.id === state.activeDrawer);
      if (todo && getTaskStatus(todo) === 'in_progress') {
        renderDrawer(todo);
      }
    }
  }, 60000);

  // ── Groups ────────────────────────────────────────────────────────────────
  // navToggle is dynamically managed by updateNavToggle()
  updateNavToggle();

  document.getElementById('gbBackBtn').addEventListener('click', () => navigateTo('/groups'));

  // "Personal tasks" button — goes back to mainContent from groups list
  document.getElementById('groupsBackBtn').addEventListener('click', () => navigateTo('/mytasks'));



  document.getElementById('newGroupBtn').addEventListener('click', showCreateGroupModal);

  // ── Group add form (matches personal task form) ──────────────────────────
  const gbInput = document.getElementById('gbTaskInput');
  const gbDropdown = document.getElementById('gbAddDropdown');

  // Open dropdown on focus
  gbInput.addEventListener('focus', () => gbDropdown.classList.add('open'));
  gbInput.addEventListener('blur', () => {
    setTimeout(() => {
      if (!document.getElementById('gbAddForm').contains(document.activeElement))
        gbDropdown.classList.remove('open');
    }, 180);
  });
  document.addEventListener('click', e => {
    if (!e.target.closest('#gbAddForm')) gbDropdown.classList.remove('open');
  });

  // Priority pill selection for group add form
  document.querySelectorAll('[data-gbp]').forEach(btn => {
    btn.addEventListener('mousedown', e => e.preventDefault());
    btn.addEventListener('click', () => {
      state.gbNewPriority = btn.dataset.gbp;
      document.querySelectorAll('[data-gbp]').forEach(b =>
        b.classList.toggle('active', b.dataset.gbp === btn.dataset.gbp)
      );
    });
  });

  // Mic button for group add input
  const gbMicBtn = document.getElementById('gbMicBtn');
  if (gbMicBtn) {
    if (!SpeechRecognition) gbMicBtn.style.display = 'none';
    else gbMicBtn.addEventListener('click', () => {
      if (!recognition) initSpeech();
      const origEnd = recognition.onend;
      recognition.onend = e2 => {
        isListening = false;
        gbMicBtn.classList.remove('mic-active');
      };
      recognition.onresult = e2 => {
        const transcript = Array.from(e2.results).map(r => r[0].transcript).join('');
        gbInput.value = transcript;
        gbDropdown.classList.add('open');
      };
      if (isListening) { recognition.stop(); return; }
      recognition.lang = SPEECH_LOCALE_MAP[state.lang] || 'en-US';
      gbInput.value = '';
      try { recognition.start(); } catch (_) { initSpeech(); recognition.start(); }
      isListening = true;
      gbMicBtn.classList.add('mic-active');
    });
  }

  // Submit handler — fixed and robust
  document.getElementById('gbAddForm').addEventListener('submit', async e => {
    e.preventDefault();
    if (!state.activeGroup) return;
    const input = document.getElementById('gbTaskInput');
    const text = input.value.trim();
    if (!text) { input.focus(); return; }
    const assignTo = document.getElementById('gbAssignSelect').value || null;
    const priority = state.gbNewPriority || 'low';
    const submitBtn = document.getElementById('gbAddSubmit');
    if (submitBtn) { submitBtn.disabled = true; submitBtn.textContent = '…'; }
    try {
      const task = await apiAddGroupTask(state.activeGroup._id, {text, assignedTo: assignTo, priority});
      if (task && task.id) {
        state.activeGroup.tasks.unshift(task);
        input.value = '';
        gbDropdown.classList.remove('open');
        // Reset priority pill to low
        state.gbNewPriority = 'low';
        document.querySelectorAll('[data-gbp]').forEach(b => b.classList.toggle('active', b.dataset.gbp === 'low'));
        renderGroupTaskList();
      } else {
        showToast((TL[state.lang]||TL.en).confirmDeleteTask ? '⚠️ Could not add task' : '⚠️ Could not add task', 'error');
      }
    } catch (err) {
      showToast('⚠️ Network error — please try again', 'error');
    } finally {
      if (submitBtn) { submitBtn.disabled = false; submitBtn.textContent = (TL[state.lang]||TL.en).add || 'Add'; }
    }
  });

  document.getElementById('gbFilterAll').addEventListener('click', () => { state.groupFilter='all'; renderGroupTaskList(); updateGbFilterBtns(); });
  document.getElementById('gbFilterMine').addEventListener('click', () => { state.groupFilter='mine'; renderGroupTaskList(); updateGbFilterBtns(); });
  document.getElementById('gbFilterUnassigned').addEventListener('click', () => { state.groupFilter='unassigned'; renderGroupTaskList(); updateGbFilterBtns(); });
  document.getElementById('gbSortSelect').addEventListener('change', e => { state.groupSort=e.target.value; renderGroupTaskList(); });

  document.getElementById('gbInviteBtn').addEventListener('click', showInviteModal);
  document.getElementById('gbSettingsBtn').addEventListener('click', () => {
    if (state.activeGroup?.slug) {
      navigateTo(`/groups/${state.activeGroup.slug}/settings`);
    } else {
      showMembersPanel();
    }
  });

  document.getElementById('gbDeleteBtn').addEventListener('click', () => {
    const g = state.activeGroup;
    const tl = TL[state.lang]||TL.en;
    confirmAction({
      title: tl.deleteGroup||'Delete Group',
      message: (tl.confirmDeleteGroup||'Delete "{group}"? All tasks will be lost.').replace('{group}',g.name),
      confirmText: tl.yes||'Yes',
      onConfirm: async () => {
        await apiDeleteGroup(g._id);
        navigateTo('/groups');
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

  // Initial route — read URL and show correct view
  const initPath = window.location.pathname || '/mytasks';
  // Replace state so back button works from initial page
  history.replaceState({ path: initPath }, '', initPath);
  await handleRoute(initPath);
});
