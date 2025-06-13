import { NextResponse } from "next/server";
import { redirect } from "next/navigation";

// Enable CORS for mobile app
const corsHeaders = {
  "Access-Control-Allow-Origin": "*",
  "Access-Control-Allow-Methods": "GET, POST, PUT, DELETE, OPTIONS",
  "Access-Control-Allow-Headers": "Content-Type, Authorization",
};

export async function OPTIONS(request) {
  return new Response(null, { status: 200, headers: corsHeaders });
}

export async function GET(request) {
  const { searchParams } = new URL(request.url);
  const token = searchParams.get('token');

  if (!token) {
    return NextResponse.json(
      { error: "Token is required" },
      { status: 400, headers: corsHeaders }
    );
  }

  // For mobile apps, redirect to a custom scheme or show a success page
  const mobileAppUrl = `cynastore://auth/verify?token=${token}`;
  
  // In development, you might want to redirect to a success page
  if (process.env.NODE_ENV === 'development') {
    return new Response(`
      <!DOCTYPE html>
      <html lang="fr">
        <head>
          <meta charset="UTF-8">
          <title>Connexion CynaStore Mobile</title>
          <meta name="viewport" content="width=device-width, initial-scale=1.0">
          <style>
            * {
              margin: 0;
              padding: 0;
              box-sizing: border-box;
            }
            body { 
              font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, sans-serif;
              background: linear-gradient(135deg, #667eea 0%, #764ba2 100%);
              min-height: 100vh;
              display: flex;
              align-items: center;
              justify-content: center;
              padding: 20px;
            }
            .container { 
              background: white;
              max-width: 400px;
              width: 100%;
              border-radius: 20px;
              box-shadow: 0 20px 40px rgba(0,0,0,0.1);
              padding: 40px 30px;
              text-align: center;
            }
            .logo {
              width: 80px;
              height: 80px;
              background: linear-gradient(135deg, #667eea 0%, #764ba2 100%);
              border-radius: 50%;
              margin: 0 auto 20px;
              display: flex;
              align-items: center;
              justify-content: center;
              font-size: 24px;
              color: white;
              font-weight: bold;
            }
            h2 {
              color: #333;
              margin-bottom: 10px;
              font-size: 24px;
              font-weight: 600;
            }
            .subtitle {
              color: #666;
              margin-bottom: 30px;
              font-size: 16px;
              line-height: 1.5;
            }
            .token-container {
              background: #f8f9fa;
              border: 2px dashed #dee2e6;
              border-radius: 12px;
              padding: 20px;
              margin: 20px 0;
              position: relative;
            }
            .token { 
              background: #e9ecef;
              padding: 15px;
              border-radius: 8px;
              word-break: break-all;
              font-family: 'Monaco', 'Menlo', monospace;
              font-size: 14px;
              margin-bottom: 15px;
              user-select: all;
            }
            .copy-btn {
              background: linear-gradient(135deg, #667eea 0%, #764ba2 100%);
              color: white;
              border: none;
              padding: 12px 24px;
              border-radius: 25px;
              cursor: pointer;
              font-size: 14px;
              font-weight: 600;
              transition: all 0.3s ease;
              width: 100%;
            }
            .copy-btn:hover {
              transform: translateY(-2px);
              box-shadow: 0 5px 15px rgba(102, 126, 234, 0.4);
            }
            .copy-btn.copied {
              background: #28a745;
            }
            .instructions {
              color: #666;
              font-size: 14px;
              margin: 20px 0;
              line-height: 1.6;
            }
            .app-btn {
              background: #28a745;
              color: white;
              border: none;
              padding: 15px 30px;
              border-radius: 25px;
              cursor: pointer;
              font-size: 16px;
              font-weight: 600;
              width: 100%;
              margin-top: 20px;
              transition: all 0.3s ease;
            }
            .app-btn:hover {
              background: #218838;
              transform: translateY(-2px);
            }
            .status {
              margin-top: 20px;
              padding: 10px;
              border-radius: 8px;
              font-size: 14px;
            }
            .status.success {
              background: #d4edda;
              color: #155724;
              border: 1px solid #c3e6cb;
            }
            .status.info {
              background: #d1ecf1;
              color: #0c5460;
              border: 1px solid #bee5eb;
            }
            @media (max-width: 480px) {
              .container {
                padding: 30px 20px;
                margin: 10px;
              }
              .token {
                font-size: 12px;
              }
            }
          </style>
        </head>
        <body>
          <div class="container">
            <div class="logo">CS</div>
            <h2>Connexion Mobile</h2>
                         <p class="subtitle">Votre token de connexion est prêt !</p>
            
            <div class="token-container">
              <div class="token" id="tokenDisplay">${token}</div>
                                            <button class="copy-btn" id="copyBtn" onclick="copyToken()">
                 📋 Copier le token
               </button>
            </div>

                         <p class="instructions">
               Le token a été automatiquement copié dans votre presse-papiers. 
               Ouvrez l'application CynaStore et collez-le dans le champ de connexion.
             </p>

                                      <button class="app-btn" onclick="openMobileApp()">
               📱 Ouvrir l'application CynaStore
             </button>

            <div id="status" class="status info">
              Tentative d'ouverture automatique de l'application...
            </div>
          </div>

          <script>
            const token = '${token}';
            const mobileAppUrl = '${mobileAppUrl}';
            
            // Copie automatique au chargement de la page
            function copyToken() {
              navigator.clipboard.writeText(token).then(function() {
                const btn = document.getElementById('copyBtn');
                const originalText = btn.innerHTML;
                                 btn.innerHTML = '✅ Copié !';
                 btn.classList.add('copied');
                
                setTimeout(() => {
                  btn.innerHTML = originalText;
                  btn.classList.remove('copied');
                }, 2000);
                
                                 updateStatus('Token copié avec succès !', 'success');
              }).catch(function(err) {
                console.error('Erreur lors de la copie: ', err);
                                 updateStatus('Erreur lors de la copie. Sélectionnez et copiez manuellement.', 'error');
              });
            }

            function openMobileApp() {
              updateStatus('Ouverture de l\\'application...', 'info');
              window.location.href = mobileAppUrl;
              
              // Fallback après 3 secondes
              setTimeout(() => {
                updateStatus('Si l\\'application ne s\\'ouvre pas, copiez le token manuellement.', 'info');
              }, 3000);
            }

            function updateStatus(message, type) {
              const status = document.getElementById('status');
              status.textContent = message;
              status.className = 'status ' + type;
            }

            // Copie automatique au chargement
            window.onload = function() {
              copyToken();
              
              // Tentative d'ouverture automatique après 2 secondes
              setTimeout(() => {
                openMobileApp();
              }, 2000);
            };
          </script>
        </body>
      </html>
    `, {
      status: 200,
      headers: {
        'Content-Type': 'text/html; charset=utf-8',
        ...corsHeaders
      }
    });
  }

  // In production, redirect to mobile app
  return redirect(mobileAppUrl);
} 