import { XMarkIcon } from "@heroicons/react/24/solid"
import { useShoppingCart } from "../../hooks/useShoppingCart";

const OrderCard = props => {
  const { 
    id,
    title,
    image,
    price,
    quantity,
    onDelete
  } = props;

  return (
    <div className="flex justify-between items-center">
      <div className="flex items-center gap-2">
        <figure className="w-20 h-20">
          <img className="w-full h-full rounded-lg object-cover" src={image} alt={title} />
        </figure>
        <div>
          <p className="text-sm font-light">{title}</p>
          {quantity && (
            <p className="text-xs text-gray-500">Cantidad: {quantity}</p>
          )}
        </div>
      </div>
      <div className="flex items-center gap-2">
        <div className="text-right">
          <p className="text-lg font-medium">${price}</p>
          {quantity && (
            <p className="text-sm text-gray-500">
              Total: ${(price * quantity).toFixed(2)}
            </p>
          )}
        </div>
        {onDelete && <XMarkIcon
          className="h-6 w-6 text-black cursor-pointer"
          onClick={() => onDelete(id)}
        />}
      </div>
    </div>
  )
}

export { OrderCard } 