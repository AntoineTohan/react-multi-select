// @flow
/**
 * This component represents an individual item in the multi-select drop-down
 */
import React, {Component} from 'react';
import {FontAwesomeIcon} from '@fortawesome/react-fontawesome';
import {faTrashAlt} from '@fortawesome/free-solid-svg-icons';

export type Option = {
    value: any,
    label: string,
    key?: string
};

type DefaultItemRendererProps = {
    checked: boolean,
    option: Option,
    disabled?: boolean,
    onClick: (event: MouseEvent) => void,
    handleEnterPress?: (inputString: string) => void,
    handleClickPressOnIcon?: (email: string) => void
};

class DefaultItemRenderer extends Component<DefaultItemRendererProps> {
    constructor(props) {
        super(props);
    }

    handleClick = () => e => {
        e.preventDefault();
        this.props.handleClickPressOnIcon(this.props.option.label);
        e.stopPropagation();
    };

    render() {
        const {checked, option, disabled} = this.props;

        const style = {
            ...styles.label,
            ...(disabled ? styles.labelDisabled : undefined),
        };
        const margin = {
            ...styles.marginRight,
        };


        return <span
            className="item-renderer"
        >
            <input
                type="checkbox"
                onChange={this.props.onClick}
                checked={checked}
                tabIndex="-1"
                disabled={disabled}
            />
            <span style={style}>
                {option.label}
                {!!option.value && <FontAwesomeIcon icon={faTrashAlt} style={margin} size="xs" color='red' pull='right' onClick={this.handleClick()}/>}
            </span>
        </span>;
    }
}

type SelectItemProps = {
    ItemRenderer: Function,
    option: Option,
    checked: boolean,
    focused?: boolean,
    disabled?: boolean,
    onSelectionChanged: (checked: boolean) => void,
    handleEnterPress?: (inputString: string) => void,
    handleClickPressOnIcon?: (email: string) => void,
    onClick: (event: MouseEvent) => void
};
type SelectItemState = {
    hovered: boolean
};

class SelectItem extends Component<SelectItemProps, SelectItemState> {
    // eslint-disable-next-line react/sort-comp
    constructor(props) {
        super(props);
    }
    static defaultProps = {
        ItemRenderer: DefaultItemRenderer,
    }

    state = {
        hovered: false,
    }

    componentDidMount() {
        this.updateFocus();
    }

    componentDidUpdate() {
        this.updateFocus();
    }

    itemRef: ?HTMLElement

    onChecked = (e: {target: {checked: boolean}}) => {
        const {onSelectionChanged} = this.props;
        const {checked} = e.target;

        onSelectionChanged(checked);
    }

    toggleChecked = () => {
        const {checked, onSelectionChanged} = this.props;
        onSelectionChanged(!checked);
    }

    handleClick = (e: MouseEvent) => {
        const {onClick} = this.props;
        this.toggleChecked();
        onClick(e);
    }

    updateFocus() {
        const {focused} = this.props;

        if (focused && this.itemRef) {
            this.itemRef.focus();
        }
    }

    handleKeyDown = (e: KeyboardEvent) => {
        switch (e.which) {
            case 13: // Enter
            case 32: // Space
                this.toggleChecked();
                break;
            default:
                return;
        }

        e.preventDefault();
    }

    render() {
        const {ItemRenderer, option, checked, focused, disabled} = this.props;
        const {hovered} = this.state;

        const focusStyle = (focused || hovered)
            ? styles.itemContainerHover
            : undefined;

        return <label
            className="select-item"
            role="option"
            aria-selected={checked}
            selected={checked}
            tabIndex="-1"
            style={{...styles.itemContainer, ...focusStyle}}
            ref={ref => this.itemRef = ref}
            onKeyDown={this.handleKeyDown}
            onMouseOver={() => this.setState({hovered: true})}
            onMouseOut={() => this.setState({hovered: false})}
        >
            <ItemRenderer
                option={option}
                handleEnterPress={this.props.handleEnterPress}
                handleClickPressOnIcon={this.props.handleClickPressOnIcon}
                checked={checked}
                onClick={this.handleClick}
                disabled={disabled}
            />
        </label>;
    }
}


const styles = {
    itemContainer: {
        boxSizing: 'border-box',
        backgroundColor: '#fff',
        color: '#666666',
        cursor: 'pointer',
        display: 'block',
        padding: '8px 10px',
    },
    itemContainerHover: {
        backgroundColor: '#ebf5ff',
        outline: 0,
    },
    label: {
        display: 'inline-block',
        verticalAlign: 'middle',
        borderBottomRightRadius: '2px',
        borderTopRightRadius: '2px',
        cursor: 'default',
        padding: '2px 5px',
    },
    labelDisabled: {
        opacity: 0.5,
    },
    trashIcon: {
        color: 'red',
    },
    marginRight: {
        marginLeft: '10px',
        marginTop: "3px",
    },
};

export default SelectItem;
