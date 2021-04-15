import SingleProduct from '../../components/SingleProduct';

function SingleProductPage({ query }) {
  return (
    <div>
      <SingleProduct id={query.id} />
    </div>
  );
}

export default SingleProductPage;
