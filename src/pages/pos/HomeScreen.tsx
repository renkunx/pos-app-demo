import { Header } from '@/components/pos/Header';
import { AmountDisplay } from '@/components/pos/AmountDisplay';
import { CustomKeypad } from '@/components/pos/CustomKeypad';

export function HomeScreen() {
  return (
    <div className="flex flex-col h-full bg-[var(--pos-bg-primary)]">
      <Header />
      <AmountDisplay />
      <CustomKeypad />
    </div>
  );
}
