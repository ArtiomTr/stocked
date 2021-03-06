import React from 'react';
import { useStockContext, StockContext, useStock } from '../../src';
import { act, renderHook } from '@testing-library/react-hooks';
import { ProxyContext } from '../../src/components/ProxyContext';
import { DummyProxy } from '../DummyProxy';

describe('Test "useStockContext" hook', () => {
    it('should throw error', () => {
        const { result } = renderHook(() => useStockContext());

        expect(result.error).toBeDefined();
    });

    it('should return stock from context', () => {
        const {
            result: { current: stock },
        } = renderHook(() => useStock({ initialValues: {} }));

        const wrapper: React.FC = ({ children }) => (
            <StockContext.Provider value={stock}>{children}</StockContext.Provider>
        );

        const { result } = renderHook(() => useStockContext(), { wrapper });

        expect(result.current).toBe(stock);
    });

    it('should return stock from arguments', () => {
        const {
            result: { current: stock },
        } = renderHook(() => useStock({ initialValues: {} }));

        const { result } = renderHook(() => useStockContext(stock));

        expect(result.current).toBe(stock);
    });

    it('should take proxy from context', () => {
        const {
            result: { current: stock },
        } = renderHook(() => useStock({ initialValues: {} }));

        const proxy = new DummyProxy('asdf');

        const watch = jest.fn();

        proxy.watch = watch;

        proxy.activate();

        const wrapper: React.FC = ({ children }) => (
            <ProxyContext.Provider value={proxy}>{children}</ProxyContext.Provider>
        );

        const { result } = renderHook(() => useStockContext(stock), { wrapper });

        expect(result.current).not.toBe(stock);

        const observer = jest.fn();

        act(() => {
            result.current.watch('asdf', observer);
            result.current.watch('aaaa', () => {});
        });

        expect(watch).lastCalledWith('asdf', observer, expect.any(Function));
    });

    it('should take proxy from arguments', () => {
        const {
            result: { current: stock },
        } = renderHook(() => useStock({ initialValues: {} }));

        const proxy = new DummyProxy('asdf');

        const watch = jest.fn();

        proxy.watch = watch;

        proxy.activate();

        const { result } = renderHook(() => useStockContext(stock, proxy));

        expect(result.current).not.toBe(stock);

        const observer = jest.fn();

        act(() => {
            result.current.watch('asdf', observer);
            result.current.watch('aaaa', () => {});
        });

        expect(watch).lastCalledWith('asdf', observer, expect.any(Function));
    });
});
