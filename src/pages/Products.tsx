import { useCart } from '@/stores/cartStore'
import styles from './Products.module.css'

const products = [
  { id: 1, name: 'Wireless Mouse', price: 25 },
  { id: 2, name: 'Mechanical Keyboard', price: 89 },
  { id: 3, name: 'USB-C Hub', price: 45 },
  { id: 4, name: '27" Monitor', price: 299 },
  { id: 5, name: 'Webcam HD', price: 65 },
]

export default function Products() {
  const { items, add, remove } = useCart()

  function getQty(id: number) {
    return items.find((i) => i.id === id)?.qty || 0
  }

  return (
    <div className={styles.page}>
      <h2 style={{ marginTop: 0 }}>Products</h2>
      <div className={styles.productList}>
        {products.map((p) => {
          const qty = getQty(p.id)
          return (
            <div key={p.id} className={styles.productCard}>
              <div>
                <div className={styles.productName}>{p.name}</div>
                <div className={styles.productPrice}>${p.price}</div>
              </div>
              <div className={styles.actions}>
                <button
                  onClick={() => remove(p.id)}
                  className={styles.btnMinus}
                  disabled={qty === 0}
                >−</button>
                <span className={styles.qty}>{qty}</span>
                <button
                  onClick={() => add(p.id, p.name, p.price)}
                  className={styles.btnPlus}
                >+</button>
              </div>
            </div>
          )
        })}
      </div>
    </div>
  )
}
