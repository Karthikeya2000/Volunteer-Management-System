import {useParams} from 'react-router-dom';
const Error = ({
  error,
  resetErrorBoundary,
}: {
  error?: Error;
  resetErrorBoundary?: (...args: any) => void;
}) => {
  const {errorCode} = useParams();
  const errorCodeMap = {
    '400': 'Invalid Request',
    '401': 'Unauthorized',
    '403': 'Forbidden',
    '404': 'Page not found',
    '500': 'Something went wrong',
    '501': 'Not implemented',
    '502': 'Bad gateway',
    '503': 'Service unavailable',
    '504': 'Gateway timeout',
    '505': 'HTTP version not supported',
    '506': 'Variant also negotiates',
    '507': 'Insufficient storage',
    '508': 'Loop detected',
    '509': 'Bandwidth limit exceeded',
    '510': 'Not extended',
    '511': 'Network authentication required',
    '520': 'Unknown error',
    '521': 'Web server is down',
    '522': 'Connection timed out',
    '523': 'Origin is unreachable',
    '524': 'A timeout occurred',
    '525': 'SSL handshake failed',
    '526': 'Invalid SSL certificate',
  };
  resetErrorBoundary ??= () => {
    window.history.back();
  };
  return (
    <section>
      <p>{error?.message ?? ''}</p>
      <section>
        <p>{errorCode}</p>
        <p>{errorCodeMap[errorCode as keyof typeof errorCodeMap]}</p>
      </section>
      <p onClick={resetErrorBoundary}>
        Try again
      </p>
    </section>
  );
};

export default Error;

