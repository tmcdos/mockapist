import { methodColor } from '@/config'

export default
{
  data ()
  {
    return {
      bgMethod: methodColor
    }
  },
  methods:
    {
      methodColor (method)
      {
        return ['GET', 'PUT', 'HEAD'].includes(method) ? '#000' : '#fff';
      }
    }
}
