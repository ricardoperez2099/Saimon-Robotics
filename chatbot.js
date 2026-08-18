(function () {
  let chatOpen = false;

  window.toggleChatbot = function () {
    chatOpen = !chatOpen;
    const tooltip = document.getElementById('chatbotTooltip');
    if (!tooltip) return;
    tooltip.style.display = chatOpen ? 'block' : 'none';
  };

  window.setTimeout(() => {
    const tooltip = document.getElementById('chatbotTooltip');
    if (tooltip && !chatOpen) {
      tooltip.style.display = 'block';
      window.setTimeout(() => {
        if (!chatOpen) tooltip.style.display = 'none';
      }, 4000);
    }
  }, 3000);
})();
