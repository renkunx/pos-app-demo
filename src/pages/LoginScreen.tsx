import { useState } from 'react';
import { Store, Eye, EyeOff } from 'lucide-react';
import { useAuthStore } from '@/stores/authStore';
import { useUiStore } from '@/stores/uiStore';
import { version } from '../../package.json';
export function LoginScreen() {
  const { login, serverUrl: savedServerUrl } = useAuthStore();
  const navigate = useUiStore((s) => s.navigate);

  const [username, setUsername] = useState('');
  const [password, setPassword] = useState('');
  const [serverUrl, setServerUrl] = useState(savedServerUrl);
  const [showPassword, setShowPassword] = useState(false);
  const [error, setError] = useState('');

  const handleLogin = () => {
    if (!username.trim()) {
      setError('请输入用户名');
      return;
    }
    if (!password.trim()) {
      setError('请输入密码');
      return;
    }
    const success = login(username.trim(), password, serverUrl.trim() || savedServerUrl);
    if (success) {
      const { user } = useAuthStore.getState();
      if (user!.role === 'system_admin') {
        navigate('profile');
        document.dispatchEvent(new Event('login-success'));
      } else {
        navigate('home');
      }
    } else {
      setError('用户名或密码错误');
    }
  };

  const handleKeyDown = (e: React.KeyboardEvent) => {
    if (e.key === 'Enter') handleLogin();
  };

  return (
    <div className="h-full flex flex-col items-center justify-center bg-[var(--pos-bg-primary)] p-8">
      {/* Logo */}
      <div className="mb-8 text-center">
        <div className="w-16 h-16 rounded-2xl bg-[var(--pos-accent-primary)] mx-auto mb-3 flex items-center justify-center shadow-lg">
          <Store size={32} className="text-white" />
        </div>
        <h1 className="text-xl font-bold text-[var(--pos-text-primary)]">POS 收银系统</h1>
        <p className="text-xs text-[var(--pos-text-secondary)] mt-1">请登录以继续</p>
      </div>

      {/* Form */}
      <div className="w-full space-y-3 mb-4">
        <div className="relative">
          <input
            type="text"
            placeholder="用户名"
            value={username}
            onChange={(e) => { setUsername(e.target.value); setError(''); }}
            onKeyDown={handleKeyDown}
            className="w-full h-12 pl-4 pr-4 bg-white rounded-xl text-sm text-[var(--pos-text-primary)] placeholder:text-[var(--pos-text-secondary)] shadow-sm outline-none focus:ring-2 focus:ring-[var(--pos-accent-primary)]/20"
          />
        </div>

        <div className="relative">
          <input
            type={showPassword ? 'text' : 'password'}
            placeholder="密码"
            value={password}
            onChange={(e) => { setPassword(e.target.value); setError(''); }}
            onKeyDown={handleKeyDown}
            className="w-full h-12 pl-4 pr-11 bg-white rounded-xl text-sm text-[var(--pos-text-primary)] placeholder:text-[var(--pos-text-secondary)] shadow-sm outline-none focus:ring-2 focus:ring-[var(--pos-accent-primary)]/20"
          />
          <button
            onClick={() => setShowPassword(!showPassword)}
            className="absolute right-3 top-1/2 -translate-y-1/2 text-[var(--pos-text-secondary)]"
          >
            {showPassword ? <EyeOff size={18} /> : <Eye size={18} />}
          </button>
        </div>

        <div className="relative">
          <input
            type="text"
            placeholder="服务器地址（可选）"
            value={serverUrl}
            onChange={(e) => setServerUrl(e.target.value)}
            onKeyDown={handleKeyDown}
            className="w-full h-12 pl-4 pr-4 bg-white rounded-xl text-sm text-[var(--pos-text-primary)] placeholder:text-[var(--pos-text-secondary)] shadow-sm outline-none focus:ring-2 focus:ring-[var(--pos-accent-primary)]/20"
          />
        </div>
      </div>

      {/* Error */}
      {error && (
        <p className="text-sm text-[var(--pos-accent-error)] mb-3">{error}</p>
      )}

      {/* Login button */}
      <button
        onClick={handleLogin}
        className="w-full h-12 bg-[var(--pos-accent-primary)] text-white rounded-xl text-base font-semibold shadow-md active:scale-[0.97] transition-transform"
      >
        登 录
      </button>

      {/* Version */}
      <p className="mt-8 text-xs text-[var(--pos-text-secondary)]">v{version}</p>
    </div>
  );
}
