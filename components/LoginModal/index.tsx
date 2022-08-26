import type { NextPage } from 'next'
import { Modal } from 'antd'

const LoginModal: NextPage<{
  isShow: boolean
  onClose?: VoidFunction
}> = ({ isShow, onClose }) => {
  return <Modal visible={isShow} onCancel={onClose && onClose}>
    <div className="">xxxxxxxxx</div>
  </Modal>
}

export default LoginModal
