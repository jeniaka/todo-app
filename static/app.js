'use strict';

// ─── State ────────────────────────────────────────────────────────────────────
const state = {
  todos: [],
  filter: 'all',
  lang: 'en',
  newPriority: 'none',
  activeDrawer: null,
  settings: null,
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
    taskReminders: true,
    dailyDigest: false,
    taskCompleted: true,
    overdueTasks: true,
    weeklyReport: false,
    notificationSound: true,
    badgeCount: true,
    doNotDisturb: false,
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
  if (mins < 60) return `${mins}m`;
  const remMins = mins % 60;
  return remMins > 0 ? `${hrs}h ${remMins}m` : `${hrs}h`;
}

function absTime(ts) {
  if (!ts) return '';
  const locale = LANGS.find(l => l.code === state.lang)?.dir === 'rtl' ? 'he-IL' : 'en-US';
  return new Date(ts).toLocaleString(locale, { month:'short', day:'numeric', hour:'2-digit', minute:'2-digit' });
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
function showToast(msg) {
  const dnd = state.settings?.notifications?.doNotDisturb;
  if (dnd) return;
  const el = document.getElementById('toast');
  if (!el) return;
  el.textContent = msg;
  el.classList.add('show');
  clearTimeout(toastTimer);
  toastTimer = setTimeout(() => el.classList.remove('show'), 2800);
}

// ─── Notification sound ───────────────────────────────────────────────────────
function playNotifSound() {
  if (!state.settings?.notifications?.notificationSound) return;
  if (state.settings?.notifications?.doNotDisturb) return;
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
    state.lang === 'he' ? 'he-IL' : state.lang === 'ar' ? 'ar-SA' : 'en-US',
    { weekday:'long', year:'numeric', month:'long', day:'numeric' }
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
    if (state.settings?.notifications?.taskCompleted) {
      showToast(`✓ ${t('taskDone')}`);
      playNotifSound();
    }
  }
  render();
  await apiSave();
}

// ─── Add task ─────────────────────────────────────────────────────────────────
async function addTodo(text) {
  if (!text.trim()) return;
  const todo = migrateTodo({
    id: Date.now(), text: text.trim(), done: false,
    priority: state.newPriority, createdAt: Date.now(),
  });
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
  state.newPriority = 'none';
  document.getElementById('pIndicator').style.background = 'var(--priority-none)';
  document.getElementById('pDropdown').style.display = 'none';
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
  { key: 'taskReminders',     nameKey: 'notifTaskReminders',     descKey: 'notifTaskRemindersDesc' },
  { key: 'dailyDigest',       nameKey: 'notifDailyDigest',       descKey: 'notifDailyDigestDesc' },
  { key: 'taskCompleted',     nameKey: 'notifTaskCompleted',     descKey: 'notifTaskCompletedDesc' },
  { key: 'overdueTasks',      nameKey: 'notifOverdueTasks',      descKey: 'notifOverdueTasksDesc' },
  { key: 'weeklyReport',      nameKey: 'notifWeeklyReport',      descKey: 'notifWeeklyReportDesc' },
  { key: 'notificationSound', nameKey: 'notifSound',             descKey: 'notifSoundDesc' },
  { key: 'badgeCount',        nameKey: 'notifBadge',             descKey: 'notifBadgeDesc' },
  { key: 'doNotDisturb',      nameKey: 'doNotDisturb',           descKey: 'doNotDisturbDesc' },
];

function renderNotifList() {
  const list = document.getElementById('notifList');
  if (!list || !state.settings) return;
  const notifs = state.settings.notifications;

  list.innerHTML = NOTIF_ITEMS.map(item => `
    <div class="notif-item">
      <div class="notif-text">
        <div class="notif-name">${t(item.nameKey)}</div>
        <div class="notif-desc">${t(item.descKey)}</div>
      </div>
      <button class="toggle-switch${notifs[item.key] ? ' on' : ''}" data-notif="${item.key}" aria-label="${t(item.nameKey)}" aria-pressed="${notifs[item.key]}"></button>
    </div>`).join('');

  list.querySelectorAll('.toggle-switch').forEach(btn => {
    btn.addEventListener('click', async () => {
      const key    = btn.dataset.notif;
      const newVal = !state.settings.notifications[key];
      state.settings.notifications[key] = newVal;
      btn.classList.toggle('on', newVal);
      btn.setAttribute('aria-pressed', String(newVal));

      // Side effects
      if (key === 'taskReminders' && newVal) {
        if ('Notification' in window && Notification.permission === 'default') {
          await Notification.requestPermission();
        }
      }
      if (key === 'badgeCount') updateBadge();
      localStorage.setItem('notif_' + key, String(newVal));
      await apiSaveSettings();
    });
  });
}

// ─── On-load notification checks ─────────────────────────────────────────────
function checkDailyDigest() {
  if (!state.settings?.notifications?.dailyDigest) return;
  if (state.settings?.notifications?.doNotDisturb) return;
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
  if (state.activeDrawer !== null) {
    closeDrawer();
  } else if (menuOpen) {
    closeMenu();
  }
  // Always re-push so the next back press is also caught.
  history.pushState({ app: true }, '');
});

// ─── Boot ─────────────────────────────────────────────────────────────────────
document.addEventListener('DOMContentLoaded', async () => {

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

  // ── Add form ──────────────────────────────────────────────────────────────
  document.getElementById('addForm').addEventListener('submit', async e => {
    e.preventDefault();
    const inp = document.getElementById('addInput');
    await addTodo(inp.value);
    inp.value = '';
    inp.focus();
  });

  // ── Priority picker ───────────────────────────────────────────────────────
  const pColors = {
    high: 'var(--priority-high)', medium: 'var(--priority-medium)',
    low:  'var(--priority-low)',  none:   'var(--priority-none)',
  };

  document.getElementById('priorityTrigger').addEventListener('click', e => {
    e.stopPropagation();
    const drop = document.getElementById('pDropdown');
    drop.style.display = drop.style.display === 'none' ? '' : 'none';
  });

  document.getElementById('pDropdown').addEventListener('click', e => {
    const opt = e.target.closest('[data-p]');
    if (!opt) return;
    state.newPriority = opt.dataset.p;
    document.getElementById('pIndicator').style.background = pColors[opt.dataset.p] || '';
    document.getElementById('pDropdown').style.display = 'none';
  });

  document.addEventListener('click', e => {
    if (!e.target.closest('#priorityTrigger') && !e.target.closest('#pDropdown'))
      document.getElementById('pDropdown').style.display = 'none';
  });

  // ── Filters ───────────────────────────────────────────────────────────────
  document.querySelectorAll('.filter-btn').forEach(b =>
    b.addEventListener('click', () => setFilter(b.dataset.filter))
  );

  // ── Clear done ────────────────────────────────────────────────────────────
  document.getElementById('clearDoneBtn').addEventListener('click', async () => {
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

  document.getElementById('drawerDeleteBtn').addEventListener('click', async () => {
    if (!confirm(t('deleteConfirm'))) return;
    const id = state.activeDrawer;
    closeDrawer();
    state.todos = state.todos.filter(x => x.id !== id);
    render();
    await apiSave();
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
});
