const CHAT_KEY = 'amancare_chat_messages';

function readChatMessages() {
  try {
    return JSON.parse(localStorage.getItem(CHAT_KEY)) || [];
  } catch {
    return [];
  }
}

function saveChatMessages(messages) {
  localStorage.setItem(CHAT_KEY, JSON.stringify(messages));
}

function injectChatWidget() {
  if (document.getElementById('chatLauncher')) return;

  const launcher = document.createElement('button');
  launcher.id = 'chatLauncher';
  launcher.className = 'chat-launcher';
  launcher.innerHTML = '<span>💬</span><span>محادثة خاصة</span>';
  launcher.onclick = toggleChatPanel;

  const panel = document.createElement('div');
  panel.id = 'chatPanel';
  panel.className = 'chat-panel';
  panel.innerHTML = `
    <div class="chat-header">
      <div>
        <h3>محادثة AmanCare</h3>
        <p>اكتب استفسارك وسنرتب طريقة التواصل المناسبة.</p>
      </div>
      <button class="chat-close" onclick="toggleChatPanel(false)">×</button>
    </div>
    <div class="chat-body" id="chatBody"></div>
    <form class="chat-form" onsubmit="submitChatMessage(event)">
      <input id="chatName" type="text" placeholder="الاسم أو الاسم المختصر" />
      <textarea id="chatText" placeholder="اكتب رسالتك هنا..."></textarea>
      <div class="chat-actions">
        <button class="chat-send" type="submit">حفظ الرسالة</button>
        <button class="chat-whatsapp" type="button" onclick="sendChatToWhatsApp()">واتساب</button>
      </div>
      <div class="chat-note">ملاحظة: المحادثة الحالية محفوظة على جهازك مؤقتًا. الحفظ الحقيقي للإدارة سيتم عند ربط Firebase.</div>
    </form>
  `;

  document.body.appendChild(panel);
  document.body.appendChild(launcher);
  renderChatMessages();
}

function toggleChatPanel(force) {
  const panel = document.getElementById('chatPanel');
  if (!panel) return;
  panel.classList.toggle('open', force);
}

function renderChatMessages() {
  const body = document.getElementById('chatBody');
  if (!body) return;

  const messages = readChatMessages();
  const initialMessage = '<div class="chat-message store">أهلًا بك في AmanCare. يمكنك كتابة استفسارك هنا، أو إرساله مباشرة عبر واتساب.</div>';

  body.innerHTML = initialMessage + messages.map((message) => `
    <div class="chat-message client">
      <b>${message.name || 'زائر'}</b><br />${message.text}
    </div>
  `).join('');

  body.scrollTop = body.scrollHeight;
}

function submitChatMessage(event) {
  event.preventDefault();

  const nameInput = document.getElementById('chatName');
  const textInput = document.getElementById('chatText');
  const text = textInput.value.trim();

  if (!text) {
    showToast('اكتب الرسالة أولاً');
    return;
  }

  const messages = readChatMessages();
  messages.push({
    name: nameInput.value.trim(),
    text,
    createdAt: new Date().toISOString()
  });

  saveChatMessages(messages);
  textInput.value = '';
  renderChatMessages();
  showToast('تم حفظ الرسالة مؤقتًا');
}

function sendChatToWhatsApp() {
  const name = document.getElementById('chatName')?.value.trim() || 'زائر';
  const text = document.getElementById('chatText')?.value.trim();

  if (!text) {
    showToast('اكتب الرسالة قبل إرسالها');
    return;
  }

  const message = `رسالة من موقع AmanCare\nالاسم: ${name}\n\n${text}`;
  window.open(`https://wa.me/${AMANCARE_CONFIG.whatsappPhone}?text=${encodeURIComponent(message)}`, '_blank');
}

window.addEventListener('load', injectChatWidget);
setTimeout(injectChatWidget, 300);
