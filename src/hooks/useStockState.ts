import { useCallback } from 'react';
import { Stock } from './useStock';
import { useStockContext } from './useStockContext';
import { useStockValue } from './useStockValue';

type SetAction<V> = (value: V) => void;

export const useStockState = <V, T extends object = object>(path: string, stock?: Stock<T>): [V, SetAction<V>] => {
    if (!stock) {
        // eslint-disable-next-line react-hooks/rules-of-hooks
        stock = useStockContext<T>();
    }

    const value = useStockValue<V, T>(path, stock);

    const { setValue } = stock;

    const set = useCallback((value: V) => setValue(path, value), [path]);

    return [value, set];
};