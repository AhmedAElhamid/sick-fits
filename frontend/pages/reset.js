import RequestReset from '../components/RequestReset';
import Reset from '../components/Reset';

function ResetPage({ query }) {
  if (!query?.token) {
    return (
      <div>
        <p>You want to reset your password ?</p>
        <RequestReset />
      </div>
    );
  }
  return (
    <div>
      <Reset token={query.token} />
    </div>
  );
}

export default ResetPage;
