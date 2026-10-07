// Функция отправки событий, которую вызывает ваш NovelManager
function SendGoalToTilda(goalId) {
    if (!goalId) return;

    console.log("[GA4 АНАЛИТИКА] Отправка события: " + goalId);

    // Шлем кастомное событие напрямую в Google Analytics
    if (typeof gtag === 'function') {
        gtag('event', goalId, {
            'event_category': 'novel_progress',
            'event_label': goalId
        });
    }
}
