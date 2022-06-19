import { GridItemType } from '../../types/GridItemType';
import * as S from './styles';
import b7Svg from '../../svgs/b7.svg';
import { items } from '../../data/items';

type Props = {
    item: GridItemType,
    onClick: () => void
}

export const GridItem = ({ item, onClick }: Props) => {
    return (
        <S.Container
            showBackground={item.permanentShown || item.shown}
            onClick={onClick}
        >
            {item.permanentShown === false && item.shown == false &&
                <S.Icon src={b7Svg} alt='' opacity={.1} />
            }
            {(item.permanentShown || item.shown) && item.item !== null &&
                <S.Icon src={items[item.item].icon} alt=''/>
            }
        </S.Container>
    )
}