import { Link } from "react-router-dom"

export default function ProductCard({product}) {
    return <div className="col">
    <div className="card h-100">    
        <img src={product.imageUrl} className="card-img-top" alt={product.name}/>
        <div className="card-body">
            <Link to={"/product/" + (product.slug || product.id)} className="nav-link">
                <h5 className="card-title">{product.name}</h5>
                <p className="card-text">{product.description}</p>
            </Link>
        </div>
        <div className="card-footer bg-transparent d-flex justify-content-between align-items-center">
            <span>₴ {product.price.toFixed(2)}</span>
            <div data-in-cart="0">
                <Link className="in-cart btn btn-success" to="/cart">
                    <i className="bi bi-cart-check"></i>
                </Link>
                <button data-product-id={product.id} className="not-in-cart btn btn-outline-success">
                    <i className="bi bi-cart"></i>
                </button>
            </div>
        </div>
    </div>
    </div>
}