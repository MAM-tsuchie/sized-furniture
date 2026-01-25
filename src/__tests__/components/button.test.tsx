import { describe, it, expect, vi } from 'vitest';
import { render, screen, fireEvent } from '@testing-library/react';
import { Button } from '@/components/ui/button';

describe('Button コンポーネント', () => {
  it('テキストを正しく表示する', () => {
    render(<Button>クリック</Button>);
    expect(screen.getByRole('button')).toHaveTextContent('クリック');
  });

  it('クリックイベントが発火する', () => {
    const handleClick = vi.fn();
    render(<Button onClick={handleClick}>クリック</Button>);
    
    fireEvent.click(screen.getByRole('button'));
    expect(handleClick).toHaveBeenCalledTimes(1);
  });

  it('disabled時はクリックできない', () => {
    const handleClick = vi.fn();
    render(<Button onClick={handleClick} disabled>クリック</Button>);
    
    fireEvent.click(screen.getByRole('button'));
    expect(handleClick).not.toHaveBeenCalled();
  });

  it('primary variantが正しいスタイルを持つ', () => {
    render(<Button variant="primary">Primary</Button>);
    const button = screen.getByRole('button');
    expect(button).toHaveClass('bg-blue-600');
  });

  it('outline variantが正しいスタイルを持つ', () => {
    render(<Button variant="outline">Outline</Button>);
    const button = screen.getByRole('button');
    expect(button).toHaveClass('border');
  });

  it('各サイズが異なる高さを持つ', () => {
    const { rerender } = render(<Button size="sm">Small</Button>);
    const smallButton = screen.getByRole('button');
    const smallClass = smallButton.className;

    rerender(<Button size="lg">Large</Button>);
    const largeButton = screen.getByRole('button');
    const largeClass = largeButton.className;

    // 異なるサイズで異なるクラスを持つことを確認
    expect(smallClass).not.toBe(largeClass);
  });
});
