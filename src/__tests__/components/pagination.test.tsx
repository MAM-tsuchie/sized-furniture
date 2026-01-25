import { describe, it, expect, vi } from 'vitest';
import { render, screen, fireEvent } from '@testing-library/react';
import { Pagination } from '@/components/ui/pagination';

describe('Pagination コンポーネント', () => {
  it('1ページの場合は何も表示しない', () => {
    const { container } = render(
      <Pagination currentPage={1} totalPages={1} onPageChange={vi.fn()} />
    );
    expect(container.firstChild).toBeNull();
  });

  it('ページ番号を表示する', () => {
    render(
      <Pagination currentPage={1} totalPages={5} onPageChange={vi.fn()} />
    );
    
    expect(screen.getByText('1')).toBeInTheDocument();
    expect(screen.getByText('5')).toBeInTheDocument();
  });

  it('ページ番号をクリックするとonPageChangeが呼ばれる', () => {
    const handlePageChange = vi.fn();
    render(
      <Pagination currentPage={1} totalPages={5} onPageChange={handlePageChange} />
    );
    
    fireEvent.click(screen.getByText('3'));
    expect(handlePageChange).toHaveBeenCalledWith(3);
  });

  it('前へボタンをクリックするとページが減る', () => {
    const handlePageChange = vi.fn();
    render(
      <Pagination currentPage={3} totalPages={5} onPageChange={handlePageChange} />
    );
    
    fireEvent.click(screen.getByLabelText('Previous page'));
    expect(handlePageChange).toHaveBeenCalledWith(2);
  });

  it('次へボタンをクリックするとページが増える', () => {
    const handlePageChange = vi.fn();
    render(
      <Pagination currentPage={3} totalPages={5} onPageChange={handlePageChange} />
    );
    
    fireEvent.click(screen.getByLabelText('Next page'));
    expect(handlePageChange).toHaveBeenCalledWith(4);
  });

  it('最初のページでは前へボタンが無効', () => {
    render(
      <Pagination currentPage={1} totalPages={5} onPageChange={vi.fn()} />
    );
    
    expect(screen.getByLabelText('Previous page')).toBeDisabled();
  });

  it('最後のページでは次へボタンが無効', () => {
    render(
      <Pagination currentPage={5} totalPages={5} onPageChange={vi.fn()} />
    );
    
    expect(screen.getByLabelText('Next page')).toBeDisabled();
  });

  it('現在のページがハイライトされる', () => {
    render(
      <Pagination currentPage={3} totalPages={5} onPageChange={vi.fn()} />
    );
    
    const currentPageButton = screen.getByLabelText('Page 3');
    expect(currentPageButton).toHaveAttribute('aria-current', 'page');
  });
});
