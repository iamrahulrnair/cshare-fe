import { useRouter } from 'next/router';
import { useState, useCallback } from 'react';
import { useDispatch } from 'react-redux';

export function useThunk(thunk) {
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState(null);
  const dispatch = useDispatch();
  const router = useRouter()
  const runThunk = useCallback(
    (arg, successHandle) => {
      setIsLoading(true);
      dispatch(thunk(arg))
        .unwrap()
        .then((data) => {
          successHandle(data);
        })
        .catch((err) => {
          setError(err)
        })
        .finally(() => setIsLoading(false));
    },
    [dispatch, thunk]
  );

  return [runThunk, isLoading, error];
}
