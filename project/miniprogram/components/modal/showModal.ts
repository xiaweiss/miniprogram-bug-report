import { getInstance } from '../../utils/index'

export const showModal: ShowModal = (config) => {
  getInstance('#modal')?.showModal(config)
}
