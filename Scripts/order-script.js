// ===========================================
// ORDER PAGE SCRIPT - Nyale Commissions
// ===========================================

// Configurações de contato
const CONTACT_CONFIG = {
    telegram: {
        username: '@nyale0102',
        url: 'https://t.me/nyalexandre'
    },
    twitter: {
        username: '@ComNyale',
        url: 'https://x.com/nyalexandre'
    },
    bluesky: {
        username: '@comnhale.bsky.social',
        url: 'https://bsky.app/profile/nyalexandre.bsky.social'
    },
    discord: {
        username: 'nyalexandre'
    }
};

document.addEventListener('DOMContentLoaded', function() {
    console.log('Order page script loaded');
    
    // Atualizar hora atual no fuso de São Paulo
    updateSaoPauloTime();
    setInterval(updateSaoPauloTime, 60000); // Atualizar a cada minuto
    
    // Configurar funcionalidade dos botões de contato
    setupContactButtons();
    
    // Configurar FAQ accordion
    setupFAQ();
    
});

// Função para atualizar e exibir a hora de São Paulo
function updateSaoPauloTime() {
    const now = new Date();
    
    // Configurar para o fuso horário de São Paulo (GMT-3)
    const options = {
        timeZone: 'America/Sao_Paulo',
        weekday: 'long',
        year: 'numeric',
        month: 'long',
        day: 'numeric',
        hour: '2-digit',
        minute: '2-digit',
        hour12: false
    };
    
    const timeElement = document.getElementById('currentTime');
    if (timeElement) {
        try {
            const formatter = new Intl.DateTimeFormat('en-US', options);
            const saoPauloTime = formatter.format(now);
            timeElement.textContent = `${saoPauloTime} (GMT-3)`;
        } catch (error) {
            console.error('Error formatting time:', error);
            // Fallback para data local
            timeElement.textContent = `${now.toLocaleString('en-US')} (Local Time)`;
        }
    }
}

// Função para configurar os botões de contato
function setupContactButtons() {
    console.log('Setting up contact buttons...');
    
    const contactButtons = document.querySelectorAll('.contact-btn');
    console.log(`Found ${contactButtons.length} contact buttons`);
    
    contactButtons.forEach(button => {
        button.addEventListener('click', function() {
            const contactType = this.getAttribute('data-contact');
            console.log(`Button clicked: ${contactType}`);
            
            if (contactType === 'discord') {
                handleDiscordContact();
            } else {
                handleSocialMediaContact(contactType);
            }
        });
    });
}

// Função para lidar com contato do Discord
function handleDiscordContact() {
    console.log('Handling Discord contact');
    
    // Copiar username do Discord
    copyToClipboard(CONTACT_CONFIG.discord.username);
    
    // Mostrar mensagem de "copiado"
    const copiedMessage = document.getElementById('discordCopied');
    if (copiedMessage) {
        copiedMessage.classList.add('show');
        
        // Remover a mensagem após 3 segundos
        setTimeout(() => {
            copiedMessage.classList.remove('show');
        }, 3000);
    }
    
    // Opcional: Também copiar os dados do formulário
    generateAndCopyMessage('discord');
}

// Função para lidar com contato de Telegram/Twitter/Bluesky
function handleSocialMediaContact(contactType) {
    console.log(`Handling ${contactType} contact`);
    
    // Gerar e copiar a mensagem
    generateAndCopyMessage(contactType);
    
    // Mostrar mensagem de "copiado"
    const copiedMessage = document.getElementById(`${contactType}Copied`);
    if (copiedMessage) {
        copiedMessage.classList.add('show');
        
        // Remover a mensagem após 3 segundos
        setTimeout(() => {
            copiedMessage.classList.remove('show');
        }, 3000);
    }
    
    // Redirecionar após um breve delay
    setTimeout(() => {
        redirectToContact(contactType);
    }, 1500); // Reduzido para 1.5 segundos para melhor UX
}

// Função para gerar a mensagem com base nos dados do formulário
function generateAndCopyMessage(contactType) {
    // Obter valores do formulário
    const commissionType = document.getElementById('commissionType').value || 'Not specified';
    const specificYCH = document.getElementById('specificYCH').value || 'Not specified';
    const characterDetails = document.getElementById('characterDetails').value || 'Not specified';
    const additionalRequests = document.getElementById('additionalRequests').value || 'None';
    const budget = document.getElementById('budget').value || 'Not specified';
    
    // Gerar a mensagem
    let message = `Hello Nyale! I came across your website and I'm interested in commissioning you.\n\n`;
    message += `Commission Type: ${getCommissionTypeLabel(commissionType)}\n`;
    
    if (specificYCH !== 'Not specified') {
        message += `Specific YCH: ${getYCHLabel(specificYCH)}\n`;
    }
    
    message += `\nCharacter Details:\n${characterDetails}\n`;
    message += `\nAdditional Requests:\n${additionalRequests}\n`;
    message += `\nBudget: ${budget === 'Not specified' ? 'Flexible' : '$' + budget + ' USD'}\n`;
    message += `\nPlease let me know if you have any slots available and what the total cost would be. Thanks!`;
    
    console.log('Generated message:', message);
    
    // Copiar para a área de transferência
    copyToClipboard(message);
    
    return message;
}

// Função auxiliar para obter rótulos de tipo de comissão
function getCommissionTypeLabel(value) {
    const labels = {
        'ych': 'YCH Commission',
        'custom': 'Custom Character Art',
        'animation': 'Animation',
        'refsheet': 'Reference Sheet',
        'other': 'Other'
    };
    return labels[value] || value;
}

// Função auxiliar para obter rótulos de YCH (ATUALIZADA)
function getYCHLabel(value) {
    const labels = {
        'comingsoon': 'Coming Soon! (YCH of the Month) - Price TBD',
        'whatych': 'What YCH! (Animation) - $40',
        'halloween2025': '2025 Halloween YCH - $15',
        'blehh': 'Blehh YCH (Animation) - $40',
        'perspective': 'Perspective YCH (Animation) - $45',
        'valentines2025': '2025 Valentines YCH (Animation) - $45',
        'happy2025': 'Happy 2025 YCH (Animation) - $30',
        'christmas2024': '2024 Christmas YCH (Animation) - $15',
        'shooter2024': '2024 Olympic Shooter YCH (Animation) - $40',
        'explosion': 'Explosion Meme YCH (Animation) - $15',
        'pedropedro': 'Pedro Pedro Meme YCH (Animation) - $40',
        'bleep': 'Bleep YCH (Animation) - $35',
        'valentines2023': '2023 Valentines YCH - $12',
        'customych': 'Custom YCH Request - Price varies'
    };
    return labels[value] || value;
}

// Função para copiar texto para a área de transferência
function copyToClipboard(text) {
    console.log('Copying to clipboard:', text.substring(0, 100) + '...');
    
    // Usar a API moderna do Clipboard se disponível
    if (navigator.clipboard && window.isSecureContext) {
        navigator.clipboard.writeText(text).then(() => {
            console.log('Text copied to clipboard successfully');
        }).catch(err => {
            console.error('Failed to copy using modern API: ', err);
            fallbackCopyToClipboard(text);
        });
    } else {
        // Fallback para navegadores mais antigos
        fallbackCopyToClipboard(text);
    }
}

// Fallback para copiar texto (método antigo)
function fallbackCopyToClipboard(text) {
    const textArea = document.createElement('textarea');
    textArea.value = text;
    textArea.style.position = 'fixed';
    textArea.style.left = '-999999px';
    textArea.style.top = '-999999px';
    document.body.appendChild(textArea);
    textArea.focus();
    textArea.select();
    
    try {
        const successful = document.execCommand('copy');
        if (successful) {
            console.log('Text copied to clipboard (fallback method)');
        } else {
            console.error('Failed to copy text (fallback method)');
        }
    } catch (err) {
        console.error('Failed to copy text: ', err);
    }
    
    document.body.removeChild(textArea);
}

// Função para redirecionar para o aplicativo de contato apropriado
function redirectToContact(contactType) {
    let url = '';
    
    switch(contactType) {
        case 'telegram':
            url = CONTACT_CONFIG.telegram.url;
            break;
        case 'twitter':
            url = CONTACT_CONFIG.twitter.url;
            break;
        case 'bluesky':
            url = CONTACT_CONFIG.bluesky.url;
            break;
        default:
            console.log(`No redirect for contact type: ${contactType}`);
            return; // Não redirecionar para discord
    }
    
    console.log(`Redirecting to: ${url}`);
    window.open(url, '_blank');
}

// Função para configurar o FAQ accordion
function setupFAQ() {
    const faqItems = document.querySelectorAll('.order-faq-container .faq-item');
    
    faqItems.forEach(item => {
        const question = item.querySelector('.faq-question');
        
        if (question) {
            question.addEventListener('click', () => {
                // Fechar outros itens abertos
                faqItems.forEach(otherItem => {
                    if (otherItem !== item && otherItem.classList.contains('active')) {
                        otherItem.classList.remove('active');
                    }
                });
                
                // Alternar o item atual
                item.classList.toggle('active');
            });
        }
    });
}
