// middleware.ts
import { NextResponse } from 'next/server'
import type { NextRequest } from 'next/server'

export function middleware(request: NextRequest) {
  const userAgent = request.headers.get('user-agent') || ''

  // 모바일/태블릿 감지
  const isMobile =
    /Android|webOS|iPhone|iPad|iPod|BlackBerry|IEMobile|Opera Mini/i.test(
      userAgent
    )

  if (isMobile) {
    // HTML 응답 반환
    return new NextResponse(
      `<!DOCTYPE html>
      <html lang="ko">
      <head>
        <meta charset="UTF-8">
        <meta name="viewport" content="width=device-width, initial-scale=1.0">
        <title>접근 제한</title>
        <style>
          * {
            margin: 0;
            padding: 0;
            box-sizing: border-box;
          }
          
          body {
            font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, 'Helvetica Neue', Arial, sans-serif;
            background-color: #f5f5f5;
            display: flex;
            align-items: center;
            justify-content: center;
            min-height: 100vh;
            padding: 20px;
          }
          
          .container {
            background: white;
            border-radius: 16px;
            padding: 40px 30px;
            max-width: 400px;
            width: 100%;
            text-align: center;
            box-shadow: 0 1px 3px rgba(0, 0, 0, 0.1);
            animation: slideIn 0.4s ease-out;
          }
          
          @keyframes slideIn {
            from {
              opacity: 0;
              transform: translateY(-20px);
            }
            to {
              opacity: 1;
              transform: translateY(0);
            }
          }
          
          .logo-container {
            width: 150px;
            height: 40px;
            margin: 0 auto 30px;
            background: linear-gradient(135deg, #667eea 0%, #764ba2 100%);
            border-radius: 8px;
            display: flex;
            align-items: center;
            justify-content: center;
            color: white;
            font-weight: 700;
            font-size: 18px;
          }
          
          .icon {
            font-size: 64px;
            margin-bottom: 20px;
          }
          
          h1 {
            color: #1a1a1a;
            font-size: 24px;
            margin-bottom: 12px;
            font-weight: 600;
          }
          
          p {
            color: #666;
            font-size: 15px;
            line-height: 1.6;
            margin-bottom: 8px;
          }
          
          .info-box {
            background: #f5f5f5;
            border-radius: 12px;
            padding: 20px;
            margin-top: 24px;
          }
          
          .info-box p {
            font-size: 14px;
            color: #444;
            margin: 0;
          }
          
          .device-icon {
            font-size: 24px;
            margin-bottom: 8px;
          }
          
          /* 다크모드 지원 */
          @media (prefers-color-scheme: dark) {
            body {
              background-color: #1a1a1a;
            }
            
            .container {
              background: #2a2a2a;
              box-shadow: 0 1px 3px rgba(255, 255, 255, 0.1);
            }
            
            h1 {
              color: #ffffff;
            }
            
            p {
              color: #b0b0b0;
            }
            
            .info-box {
              background: #1f1f1f;
            }
            
            .info-box p {
              color: #d0d0d0;
            }
          }
        </style>
      </head>
      <body>
        <div class="container">
          <div class="logo-container">
            NEXT STEP
          </div>
          
          <div class="icon">🖥️</div>
          
          <h1>접근 제한</h1>
          
          <p>죄송합니다.</p>
          <p>이 서비스는 데스크톱 환경에서만 이용 가능합니다.</p>
          
          <div class="info-box">
            <div class="device-icon">💻</div>
            <p>PC 또는 노트북으로 접속해 주세요</p>
          </div>
        </div>
      </body>
      </html>`,
      {
        status: 403,
        headers: {
          'Content-Type': 'text/html; charset=utf-8',
        },
      }
    )
  }

  return NextResponse.next()
}

// 적용할 경로 설정
export const config = {
  matcher: ['/((?!api|_next/static|_next/image|favicon.ico).*)'],
}
